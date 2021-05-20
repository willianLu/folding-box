import { singleton } from '@/utils'
import { PageName, GamePageCallbacks } from '@/types'
import GameModel from './model'
import GameView from './view'

@singleton
class GameController {
    private gameModel: GameModel
    private gameView: GameView

    constructor() {
        this.gameModel = new GameModel()
        this.gameView = new GameView()
        this.gameModel.pageEvent.attach((sender, args) => {
            this.gameView.changeView(args.pageName)
        })
    }


    initPages() {
        const gamePageCallbacks: GamePageCallbacks = {
            changeGamePage: (name: PageName) => {
                this.gameModel.setStage(name)
            },
            update: () => {
                this.gameView.update()
            }
        }

        this.gameView.init(gamePageCallbacks)
    }
}

export default GameController