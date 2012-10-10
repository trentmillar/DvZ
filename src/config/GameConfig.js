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

//game state
LL.GAME_STATE = {
    HOME:0,
    PLAY:1,
    OVER:2
};

//keys
LL.KEYS = [];

//level
LL.LEVEL = {
    STAGE1:1,
    STAGE2:2,
    STAGE3:3
};

//life
LL.LIFE = 4;

//score
LL.SCORE = 0;

//sound
LL.SOUND = true;

//enemy move type
LL.ENEMY_MOVE_TYPE = {
    ATTACK:0,
    VERTICAL:1,
    HORIZONTAL:2,
    OVERLAP:3,
    SEEKER:4
};

//delta x
LL.DELTA_X = -100;

//offset x
LL.OFFSET_X = -24;

//rot
LL.ROT = -5.625;

//bullet type
LL.BULLET_TYPE = {
    PLAYER:1,
    ENEMY:2
};

//weapon type
LL.WEAPON_TYPE = {
    ONE:1
};

//unit tag
LL.UNIT_TAG = {
    ENMEY_BULLET:900,
    PLAYER_BULLET: 901,
    PLAYER_GRENADE: 801,
    ENEMY:1000,
    PLAYER:1000
};

//attack mode
LL.ENEMY_ATTACK_MODE = {
    NORMAL:1,
    TSUIHIKIDAN:2
};

//life up sorce
LL.LIFEUP_SORCE = [50000, 100000, 150000, 200000, 250000, 300000];

//container
LL.CONTAINER = {
    ENEMIES: [],
    ENEMY_BULLETS: [],
    PLAYER_BULLETS: [],
    PLAYER_GRENADES: [],
    ROBOTS: [],
    PLAYER: null,
    PLAYER_POWERUPS: 0x0,
    addPowerup: function (a) {
        LL.CONTAINER.PLAYER_POWERUPS |= a;
    },
    removePowerup: function (a) {
        LL.CONTAINER.PLAYER_POWERUPS &= ~a;
    },
    containsPowerup: function (a) {
        return LL.CONTAINER.PLAYER_POWERUPS & a == a;
    }
};

//power ups
LL.POWERUP = {
    BULLET_AUTO: 0x1,
    GRENADES: 0x2
};
