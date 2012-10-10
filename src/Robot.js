var Robot = cc.Sprite.extend({
    eID:0,
    active:true,
    speed:200,
    bulletSpeed:-200,
    HP:15,
    bulletPowerValue:1,
    moveType:null,
    scoreValue:200,
    zOrder:1000,
    delayTime:10 + 1.2 * Math.random(),
    attackMode:LL.ENEMY_MOVE_TYPE.SEEKER,
    _hurtColorLife:0,
    _sprite:null,
    ctor:function (arg) {
        // needed for JS-Bindings compatibility
        cc.associateWithNative( this, cc.Sprite );

        var winSize = cc.Director.getInstance().getWinSize();

        /*var mgr = cc.SpriteBatchNode.create(s_image_triangle, 15);
        this.addChild(mgr, 0, TAG_SPRITE_MANAGER);*/

        this.HP = arg.HP;
        this.moveType = arg.moveType;
        this.scoreValue = arg.scoreValue;
        this.attackMode = arg.attackMode;

        //this._sprite = cc.Sprite.create(s_image_triangle);
        //this._sprite.setPosition(Math.random() * winSize.width, Math.random() * winSize.height);
        //this.addChild(this._sprite, 3000, 69);
        this.initWithSpriteFrameName(arg.textureName);
        //this.schedule(this.shoot, this.delayTime);
        this.scheduleUpdate();
    },
    _timeTick:0,
    update:function (dt) {
        if (this.HP <= 0) {
            this.active = false;
            return;
        }
        this._timeTick += dt;
        if (this._timeTick > 0.1) { return; }

        this._timeTick = 0;
        if (this._hurtColorLife > 0) {
            this._hurtColorLife--;
        }
        if (this._hurtColorLife == 1) {
            this.setColor( cc.WHITE );
        }
        if(LL.CONTAINER.PLAYER!=null){
            var player = LL.CONTAINER.PLAYER;
            var playerAngle = player.getAngle();
            //Math.atan2(LL.CONTAINER.PLAYER.getAngle())
        }
    },
    destroy:function () {
        LL.SCORE += this.scoreValue;
        var a = new Explosion();
        a.setPosition(this.getPosition());
        this.getParent().addChild(a);
        //spark(this.getPosition(),this.getParent(), 1.2, 0.7);
        cc.ArrayRemoveObject(LL.CONTAINER.ROBOTS,this);
        this.removeFromParentAndCleanup(true);
        if(LL.SOUND){
            cc.AudioEngine.getInstance().playEffect(s_sound_arrow_shot);
        }
    },
    shoot:function () {
        var p = this.getPosition();
        var b = new Bullet(this.bulletSpeed, "W2.png", this.attackMode);
        LL.CONTAINER.ENEMY_BULLETS.push(b);
        this.getParent().addChild(b, b.zOrder, LL.UNIT_TAG.ENMEY_BULLET);
        b.setPosition(cc.p(p.x, p.y - this.getContentSize().height * 0.2));
    },
    hurt:function (damage) {
        this._hurtColorLife = 2;
        this.HP-=damage;
        this.setColor( cc.RED );
    },
    collideRect:function(){
        var a = this.getContentSize();
        var p = this.getPosition();
        return cc.rect(p.x - a.width/2, p.y - a.height/4,a.width,a.height/2);
    }
});

Robot.sharedRobot = function(){
    cc.SpriteFrameCache.getInstance().addSpriteFrames(s_plist_robot, s_image_robot_sprite);
};
