import { singleton } from '@/utils'
import { PageName, GamePageCallbacks } from '@/types'
import { GameStartPage, GamePage } from '@/pages'

@singleton
class GameView {
    private gameStartPage: GameStartPage
    private gamePage: GamePage

    private callbacks: Partial<GamePageCallbacks>

    constructor() {
        this.callbacks = {}

        this.gameStartPage = new GameStartPage()
        this.gamePage = new GamePage()
    }

    changeView(pageName: PageName) {
        switch (pageName) {
            case PageName.gameStart:

                break
            case PageName.game:
                this.gameStartPage.hide()
                this.gamePage.show(this.gameStartPage.scene, this.gameStartPage.camera)
                break
            case PageName.gameOver:

                break
            default:
        }
    }

    init(callbacks: GamePageCallbacks) {
        this.callbacks = callbacks
        this.gameStartPage.init(callbacks)
    }

    update() {
        this.gamePage.update()
    }
}

export default GameView