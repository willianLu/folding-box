export enum PageName { 'gameStart', 'game', 'gameOver' }

export interface GamePageCallbacks {
    changeGamePage: (name: PageName) => void,
    update: () => void
}
