var Player = cc.Sprite.extend({
    speed: 220,
    bulletSpeed: 900,
    grenadeSpeed: 100,
    HP: 5,
    bulletTypeValue: 1,
    bulletPowerValue: 1,
    throwBombing: false,
    canBeAttack: true,
    isThrowingBomb: false,

    isShooting: false,
    shootingAngle: NaN,
    shootingWaitPeriod: 0.5,

    zOrder: 3000,
    maxBulletPowerValue: 4,
    appearPosition: cc.p(160, 60),
    _hurtColorLife: 0,
    active: true,

    isRunning: false,
    isAttacking: false,
    isLeft: false,

    ctor: function () {

        // needed for JS-Bindings compatibility
        cc.associateWithNative(this, cc.Sprite);

        //init life
        //var playerTexture = cc.TextureCache.getInstance().addImage(s_image_player_sprite);
        var playerTexture = cc.SpriteFrameCache.getInstance().getSpriteFrame("idle01.png");
        //this.initWithTexture(playerTexture, cc.rect(0, 0, 100, 100));
        this.initWithSpriteFrame(playerTexture);
        this.setTag(this.zOrder);
        this.setPosition(this.appearPosition);

        //callback for Idle anim
        var idleAnimate = cc.AnimationCache.getInstance().getAnimation("playerIdle");
        this.runAction(cc.Sequence.create(
            cc.Animate.create(idleAnimate),
            cc.CallFunc.create(this, this.idleAnim)
        ));

        //callback for Run anim
        var runAnimate = cc.AnimationCache.getInstance().getAnimation("playerRun");
        this.runAction(cc.Sequence.create(
            cc.Animate.create(runAnimate),
            cc.CallFunc.create(this, this.runAnim)
        ));

        //callback for Attack anim
        var attackAnimate = cc.AnimationCache.getInstance().getAnimation("playerAttack");
        this.runAction(cc.Sequence.create(
            cc.Animate.create(attackAnimate),
            cc.CallFunc.create(this, this.attackAnim)
        ));

        /*
        // set frame
        var frame0 = cc.SpriteFrame.createWithTexture(playerTexture, cc.rect(0, 0, 100, 100));
        var frame1 = cc.SpriteFrame.createWithTexture(playerTexture, cc.rect(100, 0, 100, 100));
        var frame2 = cc.SpriteFrame.createWithTexture(playerTexture, cc.rect(200, 0, 100, 100));

        var animFrames = [];
        animFrames.push(frame0);
        animFrames.push(frame1);
        animFrames.push(frame2);

        // ship animate
        var animation = cc.Animation.create(animFrames, 0.1);
        var animate = cc.Animate.create(animation);
        this.runAction(cc.RepeatForever.create(animate));
        this.schedule(this.shoot, 1 / 6);
        */

        //revive effect
        this.canBeAttack = false;
        /*var ghostSprite = cc.Sprite.createWithTexture(playerTexture, cc.rect(0, 0, 100, 100));
        ghostSprite.setBlendFunc(gl.SRC_ALPHA, gl.ONE);
        ghostSprite.setScale(8);
        ghostSprite.setPosition(cc.p(this.getContentSize().width / 2, 12));
        this.addChild(ghostSprite, 3000, 99999);
        ghostSprite.runAction(cc.ScaleTo.create(0.5, 1, 1));*/
        var blinks = cc.Blink.create(3, 9);
        var makeBeAttack = cc.CallFunc.create(this, function (t) {
            t.canBeAttack = true;
            t.setVisible(true);
            // t.removeChild(ghostSprite,true);
        });
        this.runAction(cc.Sequence.create(cc.DelayTime.create(0.5), blinks, makeBeAttack));
    },
    idleAnim: function () {

    },
    runAnim: function () {

    },
    attackAnim: function () {

    },
    update: function (dt) {

        // Keys are only enabled on the browser
        if (cc.config.deviceType == 'browser') {
            //non box2d
            var pos = this.getPosition();
            if ((LL.KEYS[cc.KEY.w] || LL.KEYS[cc.KEY.up]) && pos.y <= winSize.height) {
                pos.y += dt * this.speed;
            }
            if ((LL.KEYS[cc.KEY.s] || LL.KEYS[cc.KEY.down]) && pos.y >= 0) {
                pos.y -= dt * this.speed;
            }
            if ((LL.KEYS[cc.KEY.a] || LL.KEYS[cc.KEY.left]) && pos.x >= 0) {
                pos.x -= dt * this.speed;
            }
            if ((LL.KEYS[cc.KEY.d] || LL.KEYS[cc.KEY.right]) && pos.x <= winSize.width) {
                pos.x += dt * this.speed;
            }
            this.setPosition(pos);

            //box2d
            /* var pos2 = LL.CONTAINER.PLAYER.GetPosition();
            if ((LL.KEYS[cc.KEY.w] || LL.KEYS[cc.KEY.up]) && pos2.y * PTM_RATIO <= winSize.height) {
            pos2.y += (dt * this.speed) / PTM_RATIO;
            }
            if ((LL.KEYS[cc.KEY.s] || LL.KEYS[cc.KEY.down]) && pos2.y * PTM_RATIO >= 0) {
            pos2.y -= (dt * this.speed) / PTM_RATIO;
            }
            if ((LL.KEYS[cc.KEY.a] || LL.KEYS[cc.KEY.left]) && pos2.x * PTM_RATIO >= 0) {
            pos2.x -= (dt * this.speed) / PTM_RATIO;
            }
            if ((LL.KEYS[cc.KEY.d] || LL.KEYS[cc.KEY.right]) && pos2.x * PTM_RATIO <= winSize.width) {
            pos2.x += (dt * this.speed) / PTM_RATIO;
            }
            LL.CONTAINER.PLAYER.SetPosition( pos2 );
            */
        }

        if (this.HP <= 0) {
            this.active = false;
        }
        this._timeTick += dt;
        if (this._timeTick > 0.1) {
            this._timeTick = 0;
            if (this._hurtColorLife > 0) {
                this._hurtColorLife--;
            }
            if (this._hurtColorLife == 1) {
                this.setColor(cc.WHITE);
            }
        }
    },
    shoot: function () {
        //this.shootEffect();
        /*var offset = 13;
        var p = this.getPosition();
        var cs = this.getContentSize();
        var a = new Bullet(this.bulletSpeed, "W1.png", LL.ENEMY_MOVE_TYPE.NORMAL);
        LL.CONTAINER.PLAYER_BULLETS.push(a);
        this.getParent().addChild(a, a.zOrder, LL.UNIT_TAG.PLAYER_BULLET);
        a.setPosition(cc.p(p.x + offset, p.y + 3 + cs.height * 0.3));

        var b = new Bullet(this.bulletSpeed, "W1.png", LL.ENEMY_MOVE_TYPE.NORMAL);
        LL.CONTAINER.PLAYER_BULLETS.push(b);
        this.getParent().addChild(b, b.zOrder, LL.UNIT_TAG.PLAYER_BULLET);
        b.setPosition(cc.p(p.x - offset, p.y + 3 + cs.height * 0.3));*/
        var offset = 13;
        var shotAngle = this.shootingAngle;
        var yOffset = Math.cos(shotAngle) * offset;
        var xOffset = Math.sin(shotAngle) * offset;

        var p = this.getPosition();
        var cs = this.getContentSize();
        var projA = new Bullet(this.bulletSpeed, "W1.png", LL.ENEMY_MOVE_TYPE.NORMAL);
        LL.CONTAINER.PLAYER_BULLETS.push(projA);
        this.getParent().addChild(projA, projA.zOrder, LL.UNIT_TAG.PLAYER_BULLET);
        //projA.setPosition(cc.p(p.x + offset, p.y + 3 + cs.height * 0.3));
        projA.setPosition(cc.p(p.x + xOffset + offset, p.y + yOffset + 3 + cs.height * 0.3));
        projA.setRotation(this.shootingAngle);//fixme setAngle doesn't exist

        var projB = new Bullet(this.bulletSpeed, "W1.png", LL.ENEMY_MOVE_TYPE.NORMAL);
        LL.CONTAINER.PLAYER_BULLETS.push(projB);
        this.getParent().addChild(projB, projB.zOrder, LL.UNIT_TAG.PLAYER_BULLET);
        projB.setPosition(cc.p(p.x + xOffset - offset, p.y + yOffset + 3 + cs.height * 0.3));
        projB.setRotation(this.shootingAngle); //fixme setAngle doesn't exist
    },
    destroy: function () {
        LL.LIFE--;
        var p = this.getPosition();
        var myParent = this.getParent();
        myParent.addChild(new Explosion(p));
        myParent.removeChild(this, true);
        if (LL.SOUND) {
            cc.AudioEngine.getInstance().playEffect(s_sound_arrow_shot);
        }
    },
    hurt: function () {
        if (this.canBeAttack) {
            this._hurtColorLife = 2;
            this.HP--;
            this.setColor(cc.RED);
        }
    },
    collideRect: function () {
        var p = this.getPosition();
        var a = this.getContentSize();
        var r = new cc.rect(p.x - a.width / 2, p.y - a.height / 2, a.width, a.height / 2);
        return r;
    }
});

Player.sharedPlayer = function() {

    //cache up sprites
    cc.SpriteFrameCache.getInstance().addSpriteFrames(s_plist_player);

    //idle animation
    var idleFrames = [];
    idleFrames.push(cc.SpriteFrameCache.getInstance().getSpriteFrame("idle01.png"));
    idleFrames.push(cc.SpriteFrameCache.getInstance().getSpriteFrame("idle02.png"));
    idleFrames.push(cc.SpriteFrameCache.getInstance().getSpriteFrame("idle03.png"));
    var idleAnimation = cc.Animation.create(idleFrames, 0.1);
    //var idleAnimate = cc.Animate.create(idleAnimation);

    //run animation
    var runFrames = [];
    runFrames.push(cc.SpriteFrameCache.getInstance().getSpriteFrame("run01.png"));
    runFrames.push(cc.SpriteFrameCache.getInstance().getSpriteFrame("run02.png"));
    runFrames.push(cc.SpriteFrameCache.getInstance().getSpriteFrame("run03.png"));
    runFrames.push(cc.SpriteFrameCache.getInstance().getSpriteFrame("run04.png"));
    var runAnimation = cc.Animation.create(runFrames);
    //var runAnimate = cc.Animate.create(runAnimation);

    //attack animation
    var attackFrames = [];
    attackFrames.push(cc.SpriteFrameCache.getInstance().getSpriteFrame("attack01.png"));
    attackFrames.push(cc.SpriteFrameCache.getInstance().getSpriteFrame("attack02.png"));
    var attackAnimation = cc.Animation.create(attackFrames);
    //var attackAnimate = cc.Animate.create(attackAnimation);

    cc.AnimationCache.getInstance().addAnimation(idleAnimation, "playerIdle");
    cc.AnimationCache.getInstance().addAnimation(runAnimation, "playerRun");
    cc.AnimationCache.getInstance().addAnimation(attackAnimation, "playerAttack");

};
