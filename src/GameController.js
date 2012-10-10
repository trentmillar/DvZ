/**
 *  Cocos2d-html5 show case : Moon Warriors
 *
 * @Licensed:
 * This showcase is licensed under GPL.
 *
 *  @Authors:
 *  Programmer: Shengxiang Chen (陈升想), Dingping Lv (吕定平), Ricardo Quesada
 *  Effects animation: Hao Wu (吴昊)
 *  Quality Assurance: Sean Lin (林顺)
 *
 *  @Links:
 *  http://www.cocos2d-x.org
 *  http://bbs.html5china.com
 *
 */


LL.GameController = cc.Class.extend({
    _curScene: null,
    _gameTime: 0,
    _gameState: LL.GAME_STATE.HOME,
    _isNewGame: true,
    _curLevel: LL.LEVEL.STAGE1,
    _selectLevel: LL.LEVEL.STAGE1,
    init: function () {
        return true;
    },
    setCurScene: function (s) {
        if (this._curScene != s) {
            if (this._curScene !== null) {
                this._curScene.onExit();
            }
            this._curScene = s;
            if (this._curScene) {
                this._curScene.onEnter();
                cc.Director.getInstance().replaceScene(s);
            }
        }
    },
    getCurScene: function () {
        return this._curScene;
    },
    runGame: function () {

    },
    newGame: function () {

    },
    option: function () {

    },
    about: function () {

    },
    setGameTime: function (dt) {
        if (dt > 0) {
            this._gameTime += dt;
        }
    },
    getGameTime: function () {
        return this._gameTime;
    }
});

LL.GameController.getInstance = function () {
    cc.Assert(this._sharedGame, "Havn't call setSharedGame");
    if (!this._sharedGame) {
        this._sharedGame = new LL.GameController();
        if (this._sharedGame.init()) {
            return this._sharedGame;
        }
    } else {
        return this._sharedGame;
    }
    return null;
};

LL.GameController._sharedGame = null;