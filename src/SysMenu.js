cc.dumpConfig();
var winSize;

var SysMenu = cc.Layer.extend({
    _player: null,

    ctor: function () {
        cc.associateWithNative(this, cc.Layer);
    },
    init: function () {
        var bRet = false;
        if (this._super()) {
            winSize = cc.Director.getInstance().getWinSize();
            var sp = cc.Sprite.create(s_image_empty);
            sp.setAnchorPoint(cc.p(0, 0));
            //sp.setPosition(cc.p(0, 250));
            this.addChild(sp, 0, 1);

            var logo = cc.Sprite.create(s_image_empty);
            var logoSize = logo.getContentSize();
            logo.setAnchorPoint(cc.p(0, 0));
            logo.setPosition(cc.p(logoSize.width / 2, winSize.height - logoSize.height));
            this.addChild(logo, 10, 1);

            var newGameNormal = cc.Sprite.create(s_image_menu_back);
            var newGameSelected = cc.Sprite.create(s_image_menu_back);
            var newGameDisabled = cc.Sprite.create(s_image_menu_back);

            var gameSettingsNormal = cc.Sprite.create(s_image_menu_back);
            var gameSettingsSelected = cc.Sprite.create(s_image_menu_back);
            var gameSettingsDisabled = cc.Sprite.create(s_image_menu_back);

            var aboutNormal = cc.Sprite.create(s_image_menu_back);
            var aboutSelected = cc.Sprite.create(s_image_menu_back);
            var aboutDisabled = cc.Sprite.create(s_image_menu_back);

            /*var newGame = cc.MenuItemSprite.create(newGameNormal, newGameSelected, newGameDisabled, this, function () {
            this.onButtonEffect();
            flareEffect(this, this, this.onNewGame);
            });*/
            var newGame = cc.MenuItemSprite.create(newGameNormal, newGameSelected, newGameDisabled, this, this.onNewGame);

            var gameSettings = cc.MenuItemSprite.create(gameSettingsNormal, gameSettingsSelected, gameSettingsDisabled, this, this.onSettings);
            var about = cc.MenuItemSprite.create(aboutNormal, aboutSelected, aboutDisabled, this, this.onAbout);

            var menu = cc.Menu.create(newGame, gameSettings, about);
            menu.alignItemsVerticallyWithPadding(10);
            this.addChild(menu, 1, 2);
            menu.setPosition(cc.p(winSize.width / 2, winSize.height / 2 - 80));
            this.schedule(this.update, 0.1);

            var tmp = cc.TextureCache.getInstance().addImage(s_image_menu_back);
            //this._player = cc.Sprite.createWithTexture(tmp,cc.rect(0, 45, 60, 38));
            this._player = cc.Sprite.createWithTexture(tmp);
            this.addChild(this._player, 0, 4);
            var pos = cc.p(Math.random() * winSize.width, 0);
            this._player.setPosition(pos);
            //this._player.runAction(cc.MoveBy.create(2, cc.p(Math.random() * winSize.width, pos.y + winSize.height + 100)));

            /*if (LL.SOUND) {
                cc.AudioEngine.getInstance().setBackgroundMusicVolume(0.7);
                cc.AudioEngine.getInstance().playBackgroundMusic(s_music_theme, true);
            }*/

            bRet = true;
        }

        return bRet;
    },
    onNewGame: function (pSender) {
        var scene = cc.Scene.create();
        scene.addChild(GameLayer.create());
        scene.addChild(GameControlMenu.create());
        cc.Director.getInstance().replaceScene(cc.TransitionFade.create(1.2, scene ));
    },
    onSettings: function (pSender) {
        this.onButtonEffect();
        var scene = cc.Scene.create();
        scene.addChild(SettingsLayer.create());
        cc.Director.getInstance().replaceScene(cc.TransitionFade.create(1.2, scene));
    },
    onAbout: function (pSender) {
        this.onButtonEffect();
        var scene = cc.Scene.create();
        scene.addChild(AboutLayer.create());
        cc.Director.getInstance().replaceScene(cc.TransitionFade.create(1.2, scene));
    },
    update: function () {
        if (this._player.getPosition().y > winSize.height) {
            var pos = cc.p(Math.random() * winSize.width, 10);
            this._player.setPosition(pos);
            this._player.runAction(cc.MoveBy.create(
                parseInt(5 * Math.random(), 10),
                cc.p(Math.random() * winSize.width, pos.y + winSize.height)));
        }
    },
    onButtonEffect: function () {
        if (LL.SOUND) {
            cc.AudioEngine.getInstance().playEffect(s_sound_arrow_shot);
        }
    }
});

SysMenu.create = function () {
    var sg = new SysMenu();
    if (sg && sg.init()) {
        return sg;
    }
    return null;
};

SysMenu.scene = function () {
    var scene = cc.Scene.create();
    var layer = SysMenu.create();
    scene.addChild(layer);
    return scene;
};
