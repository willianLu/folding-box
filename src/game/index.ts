import GameController from './controller'

/*
* 游戏入口
* */

class Game {
    init() {
        new GameController().initPages()
    }
}

export default new Game()