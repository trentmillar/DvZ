var Grenade = cc.Sprite.extend({
    active: true,
    radius: 50,
    travelFactor: 0.003,
    targetPosition: 0,
    modifier: 0,
    xVelocity: 0,
    yVelocity: 100,
    damage: 10,
    HP: 1,
    moveType: null,
    zOrder: 3000,
    attackMode: LL.ENEMY_MOVE_TYPE.NORMAL,
    parentType: LL.BULLET_TYPE.PLAYER,
    ctor: function (speed, weaponType, attackMode) {
        // needed for JS-Bindings compatibility
        cc.associateWithNative(this, cc.Sprite);

        this.yVelocity = -speed;
        this.attackMode = attackMode;

        cc.SpriteFrameCache.getInstance().addSpriteFrames(s_plist_grenade);
        this.initWithSpriteFrameName(weaponType);
        this.setBlendFunc(gl.SRC_ALPHA, gl.ONE);

        //pre calc the factor for where pineapple lands
        var rand = Math.random();
        if (rand < 0.3) {
            this.mod = -1;
        } else if (rand > 0.7) {
            this.mod = 1;
        } else {
            this.mod = 0;
        }

        /*var tmpAction;
        switch (this.attackMode) {
        case LL.ENEMY_MOVE_TYPE.NORMAL:
        tmpAction = cc.MoveBy.create(2, cc.p(this.getPosition().x, 400));
        break;
        case LL.ENEMY_ATTACK_MODE.TSUIHIKIDAN:
        tmpAction = cc.MoveTo.create(2, GameLayer.create()._player.getPosition());
        break;
        }
        this.runAction(tmpAction);*/

    },
    update: function (dt) {
        /*var p = this.getPosition();
        p.x -= this.xVelocity * dt;
        p.y -= this.yVelocity * dt;
        this.setPosition( p );*/
        if (this.HP <= 0) {
            this.active = false;
        }

        //test if reached destionation

        if (cc.pSub(this.targetPosition, this.getPosition()) < this.mod * this.radius) {
            //this.stopActionByTag(LL.UNIT_TAG.PLAYER_GRENADE);
            //cc.ArrayRemoveObject(LL.CONTAINER.PLAYER_GRENADES, this);
            this.destroy();

            //damage
            for (var i = 0; i < LL.CONTAINER.ROBOTS.length; i++) {
                var robot = LL.CONTAINER.ROBOTS[i];
                var pos = robot.getPosition();
                var distance = cc.pDistance(pos, this.getPosition());
                if (distance < this.radius) {
                    robot.hurt(this.damage);
                }
            }
        }
    },
    destroy: function () {
        var explode = cc.Sprite.create(s_image_hit);
        explode.setBlendFunc(gl.SRC_ALPHA, gl.ONE);
        explode.setPosition(this.getPosition());
        explode.setRotation(Math.random() * 360);
        explode.setScale(0.75);
        this.getParent().addChild(explode, 9999);

        this.stopActionByTag(LL.UNIT_TAG.PLAYER_GRENADE);
        cc.ArrayRemoveObject(LL.CONTAINER.PLAYER_GRENADES, this);
        this.removeFromParentAndCleanup(true);
        var removeExplode = cc.CallFunc.create(explode, explode.removeFromParentAndCleanup);
        explode.runAction(cc.ScaleBy.create(0.6, 3, 3));
        explode.runAction(cc.Sequence.create(cc.FadeOut.create(0.6), removeExplode));
    },
    hurt: function () {
        this.HP--;
    },
    collideRect: function () {
        var p = this.getPosition();
        return cc.rect(p.x - 3, p.y - 3, 6, 6);
    }
});
