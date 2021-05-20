import { singleton, Event } from '@/utils'
import { PageName } from '@/types'

@singleton
class GameModel {
    public pageEvent: Event<GameModel>
    public pageName: PageName

    constructor() {
        this.pageEvent = new Event<GameModel>(this)
        this.pageName = PageName.gameStart
    }

    setStage(pageName: PageName) {
        this.pageName = pageName
        this.pageEvent.notify({
            pageName: pageName
        })
    }
}

export default GameModel