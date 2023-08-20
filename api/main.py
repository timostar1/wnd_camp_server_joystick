from dataclasses import dataclass

from flask import Flask
from flask import redirect
from flask import render_template
from flask import request
from flask import session
from flask import url_for
from flask_sock import Sock
import json
import logging
from logging import config as logging_config
import uuid

log_config = {
    "version": 1,
    "root": {
        "handlers": ["console"],
        "level": "DEBUG",
    },
    "handlers": {
        "console": {
            "formatter": "std_out",
            "class": "logging.StreamHandler",
            "level": "DEBUG",
        },
        # "file": {
        #     "formatter": "std_out",
        #     "class": "logging.FileHandler",
        #     "level": LOGS_LEVEL,
        #     "filename": LOGS_DIR / "all_messages.log",
        #     "encoding": "utf-8",
        # },
        # "error_file": {
        #     "formatter": "std_out",
        #     "class": "logging.FileHandler",
        #     "level": "ERROR",
        #     "filename": LOGS_DIR / "error.log",
        #     "encoding": "utf-8",
        # },
    },
    "formatters": {
        "std_out": {
            "format": "%(asctime)s %(name)s %(levelname)s: %(message)s",
        },
    },
}

logging_config.dictConfig(log_config)


app = Flask(__name__)
app.secret_key = b'5DCsd#y2zx8zdcKSDVlmc]'
sock = Sock(app)
logger = logging.getLogger(__name__)


@dataclass
class JoystickState:
    x: int = 0
    y: int = 0
    turn: int = 0

    def as_json(self):
        return json.dumps({'x': self.x, 'y': self.y, 'turn': self.turn})


@dataclass
class PlatformState:
    dist_front: int = 0
    dist_back: int = 0
    front_left: int = 0
    front_right: int = 0
    back_left: int = 0
    back_right: int = 0

    def as_json(self):
        return json.dumps({
            'distFront': self.dist_front,
            'distBack': self.dist_back,
            'backLeft': self.back_left,
            'backRight': self.back_right,
            'frontLeft': self.front_left,
            'frontRight': self.front_right,
        })

    def from_dict(self, data: dict):
        self.dist_front = data['FS']
        self.dist_back = data['BS']
        self.back_left = data['BL']
        self.back_right = data['BR']
        self.front_left = data['FL']
        self.front_right = data['FR']


@dataclass
class Client:
    key: str = None


active_client = Client
joystick_state = JoystickState()
platform_state = PlatformState()


@app.route("/")
def index():
    if 'client_key' not in session:
        if active_client.key is None:
            return redirect(url_for('auth'))
        return redirect(url_for('auth_need'))
    if session['client_key'] == active_client.key:
        logger.debug('loading base.html')
        return render_template('base.html')
    else:
        return redirect(url_for('auth_need'))


@app.get('/auth_need')
def auth_need():
    return render_template('auth_need.html')


@app.route('/auth', methods=['GET', 'POST'])
def auth():
    if request.method == 'GET':
        client_key = _gen_client_key()
        active_client.key = client_key
        session['client_key'] = client_key
        return redirect(url_for('index'))


@app.route("/hello")
def hello():
    return {'status': 'ok', 'message': 'Hello, World!'}


@app.get('/check_session')
def check_session():
    return json.dumps(
        {'session_active': session['client_key'] == active_client.key},
    )


@sock.route("/websocket")
def websocket(ws):
    while True:
        data = ws.receive()
        try:
            joy_state = json.loads(str(data).strip())
            logger.debug(f'{data=}')
        except json.decoder.JSONDecodeError:
            logger.exception('json.decoder.JSONDecodeError', exc_info=True)
            continue

        if not isinstance(joy_state, dict):
            logger.error(
                f'joy_state is not a dict instance.\n'
                f'type(joy_state)={type(joy_state)}, joy_state={joy_state}'
            )
            continue

        joystick_state.x = int(joy_state.get('x', 0))
        joystick_state.y = int(joy_state.get('y', 0))
        joystick_state.turn = int(joy_state.get('turn', 0))

        ws.send(platform_state.as_json())


@app.get('/state')
def state():
    return joystick_state.as_json()


@app.post('/state')
def post_state():
    logger.debug(request.data)
    pl_data = json.loads(request.data)
    platform_state.from_dict(pl_data)
    return '{"status": "ok"}'


def _gen_client_key() -> str:
    return uuid.uuid4().hex


if __name__ == '__main__':
    app.run(host='192.168.1.146', port=5000)
