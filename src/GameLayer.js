STATE_PLAYING = 0;
STATE_GAMEOVER = 1;

var TAG_SPRITE_MANAGER = 1;

var CMenu = cc.Sprite.extend({
    defaultScale: 0.8,
    hovered: false,
    boundingBox: null,
    onClickCallback: null,
    ctor: function (tex) {
        this._super();
        this.initWithTexture(tex);
        this.setScale(this.defaultScale);
    },
    onClick: function (callback) {
        this.onClickCallback = callback;
    },
    handleTouches: function (touch, evt) {
        (this.hovered && this.onClickCallback) && this.onClickCallback();
    },
    handleTouchesMoved: function (touch, evt) {
        var point = touch[0].getLocation();

        this.boundingBox || (this.boundingBox = this.getBoundingBox());

        if (cc.Rect.CCRectContainsPoint(this.boundingBox, point)) {
            if (!this.hovered) {
                this.hovered = true;
                this.runAction(cc.ScaleTo.create(0.01, 1));
            }
        } else if (this.hovered) {
            this.hovered = false;
            this.runAction(cc.ScaleTo.create(0.01, this.defaultScale));
        }
    },
    handleTouchesEnded: function (touch, evt) { }
});

var GameLayer = cc.Layer.extend({
    gameObjects: [],
    birdSprite: null,
    isDraggingSling: false,
    birdStartPos: cc.p(260, 440.5),
    slingRadius: {
        min: 20,
        max: 80
    },
    slingAngle: {
        min: cc.DEGREES_TO_RADIANS(250),
        max: cc.DEGREES_TO_RADIANS(295)
    },
    smokeDistance: 16,
    menus: [],
    lastSmoke: null,
    slingRubber1: null,
    slingRubber2: null,
    slingRubber3: null,
    getTexture: function (name) {
        return cc.TextureCache.getInstance()
            .addImage('res/image/' + name + '.png');
    },
    addObject: function (desc) {
        var sprite = cc.Sprite.createWithTexture(this.getTexture(desc.name));

        sprite.setAnchorPoint(desc.anchor || cc.p(0.5, 0.5));
        sprite.setScaleX(desc.scaleX || desc.scale || 1);
        sprite.setScaleY(desc.scaleY || desc.scale || 1);
        sprite.setRotation(desc.rotation || 0);
        sprite.setPosition(cc.p(desc.x || 0, desc.y || 0));
        sprite.setTag(desc.tag);

        desc.shape && b2.enablePhysicsFor({
            type: desc.type,
            shape: desc.shape,
            sprite: sprite,
            radius: desc.radius,
            density: desc.density,
            userData: desc.userData
        });

        this.addChild(sprite, desc.z || 0);
        return sprite;
    },
    ctor: function() {
    cc.associateWithNative(this, cc.Layer);
    },
    init: function () {
        var bReturn = false;
        if (this._super()) {
            this.removeAllChildrenWithCleanup(true);
            this.setTouchEnabled(true);

            var director = cc.Director.getInstance(),
                self = this,
                winSize = director.getWinSize();

            b2.initWorld();

            //TODO change to read from json level file.

            var bgSprite = this.addObject({
                name: "bg",
                tag: 1,
                scaleY: 0.8,
                anchor: cc.p(0, 0),
                z: -1
            });
            this.gameObjects.push(bgSprite);

            var groundSprite = this.addObject({
                name: "ground",
                tag: 2,
                scaleX: 2.5,
                anchor: cc.p(0, 0),
                type: "static",
                shape: "box",
                density: 0
            });
            this.gameObjects.push(groundSprite);

            var platformSprite = this.addObject({
                name: "platform",
                tag: 3,
                y: 30,
                scale: 1.5,
                anchor: cc.p(0, 0),
                type: "static",
                shape: "box",
                density: 0
            });
            this.gameObjects.push(platformSprite);

            var sling1Sprite = this.addObject({
                name: "sling1",
                tag: 4,
                x: 284.5,
                y: 319.5,
                scale: 0.7,
                anchor: cc.p(1, 0)
            });
            this.gameObjects.push(sling1Sprite);

            var sling2Sprite = this.addObject({
                name: "sling2",
                tag: 5,
                x: 268.5,
                y: 376.5,
                scale: 0.7,
                anchor: cc.p(1, 0),
                z: 3
            });
            this.gameObjects.push(sling2Sprite);

            var cube1Sprite = this.addObject({
                name: "wood1",
                tag: 6,
                x: 840.5,
                y: 71,
                type: "dynamic",
                shape: "box",
                userData: new BodyUserData(GameObjectRoll.Wood, 2000)
            });
            this.gameObjects.push(cube1Sprite);

            var cube2Sprite = this.addObject({
                name: "wood1",
                tag: 7,
                x: 1017.5,
                y: 71,
                type: "dynamic",
                shape: "box",
                userData: new BodyUserData(GameObjectRoll.Wood, 2000)
            });
            this.gameObjects.push(cube2Sprite);

            var hWood1Sprite = this.addObject({
                name: "wood2",
                tag: 8,
                x: 931.5,
                y: 131.5,
                scaleX: 1.3,
                type: "dynamic",
                shape: "box",
                userData: new BodyUserData(GameObjectRoll.Wood, 2000)
            });
            this.gameObjects.push(hWood1Sprite);

            var hWood2Sprite = this.addObject({
                name: "wood2",
                tag: 9,
                x: 931.5,
                y: 251.5,
                scaleX: 1.3,
                type: "dynamic",
                shape: "box",
                userData: new BodyUserData(GameObjectRoll.Wood, 2000)
            });
            this.gameObjects.push(hWood2Sprite);

            var hWood3Sprite = this.addObject({
                name: "wood2",
                tag: 10,
                x: 880,
                y: 330,
                rotation: -40,
                scaleX: 0.8,
                type: "dynamic",
                shape: "box",
                userData: new BodyUserData(GameObjectRoll.Wood, 2000)
            });
            this.gameObjects.push(hWood3Sprite);

            var hWood4Sprite = this.addObject({
                name: "wood2",
                tag: 11,
                x: 980,
                y: 330,
                rotation: 40,
                scaleX: 0.8,
                type: "dynamic",
                shape: "box",
                userData: new BodyUserData(GameObjectRoll.Wood, 2000)
            });
            this.gameObjects.push(hWood3Sprite);

            var cube3Sprite = this.addObject({
                name: "wood1",
                tag: 12,
                x: 840.5,
                y: 200.5,
                type: "dynamic",
                shape: "box",
                userData: new BodyUserData(GameObjectRoll.Wood, 2000)
            });
            this.gameObjects.push(cube3Sprite);

            var cube4Sprite = this.addObject({
                name: "wood1",
                x: 1017.5,
                y: 200.5,
                type: "dynamic",
                shape: "box",
                userData: new BodyUserData(GameObjectRoll.Wood, 2000)
            });
            this.gameObjects.push(cube4Sprite);

            var cube5Sprite = this.addObject({
                name: "wood1",
                x: 930,
                y: 300,
                type: "dynamic",
                shape: "box",
                userData: new BodyUserData(GameObjectRoll.Wood, 2000)
            });
            this.gameObjects.push(cube5Sprite);

            var enemySprite = this.addObject({
                name: "enemy",
                x: 931.5,
                y: 71,
                type: "dynamic",
                shape: "circle",
                density: 2,
                userData: new BodyUserData(GameObjectRoll.Enemy, 400)
            });

            this.gameObjects.push(enemySprite);

            var enemy2Sprite = this.addObject({
                name: "enemy",
                x: 931.5,
                y: 180,
                type: "dynamic",
                shape: "circle",
                density: 2,
                userData: new BodyUserData(GameObjectRoll.Enemy, 400)
            });
            this.gameObjects.push(enemy2Sprite);

            this.birdSprite = this.addObject({
                name: "bird",
                x: 200,
                y: 345,
                z: 1
            });

            this.slingRubber1 = this.addObject({
                name: "sling3",
                x: 278,
                y: 436,
                scaleY: 0.7,
                scaleX: 0,
                anchor: cc.p(1, 0.5),
                z: 0
            });
            this.slingRubber2 = this.addObject({
                name: "sling3",
                x: 250,
                y: 440,
                scaleY: 0.7,
                scaleX: 0,
                anchor: cc.p(1, 0.5),
                z: 2
            });
            this.slingRubber3 = null;

            // --------- Top Menu ! ---------

            var margin = 25,
                backMenu = new CMenu(this.getTexture("menu_back"));
            backMenu.setPosition(cc.p(margin, winSize.height - margin));
            backMenu.onClick(function () {
                window.location.href = "http://#";
            });
            this.addChild(backMenu);
            this.menus.push(backMenu);

            var refreshMenu = new CMenu(this.getTexture("menu_refresh"));
            refreshMenu.setPosition(cc.p(70, winSize.height - margin));
            refreshMenu.onClick(function () {
                self.init();
            });
            this.addChild(refreshMenu);
            this.menus.push(refreshMenu);

            // --------- My Score ! ---------

            var scoreLabel = cc.LabelTTF.create("0", "fantasy", 20, cc.size(0, 0), cc.TEXT_ALIGNMENT_LEFT);
            scoreLabel.setPosition(cc.p(winSize.width - 80, winSize.height));
            scoreLabel.schedule(function () {
                var showingScore = parseInt(scoreLabel.getString());
                if (showingScore < b2.getUserScore()) {
                    scoreLabel.setString((showingScore + 5)
                            .toString());
                }
            });
            this.addChild(scoreLabel, 5);

            // --------- Setup Sling's Bomb ! ---------

            var action = cc.Spawn.create(cc.RotateBy.create(1, 360), cc.JumpTo.create(1, this.birdStartPos, 100, 1));
            this.birdSprite.runAction(action);

            this.scheduleUpdate();

            bReturn = true;
        }
        return bReturn;
    },
    freeze: function() {
        var isDone = true;
        var i;
        var b = b2.getBodies();
        for(i=0; i<b.length; i++)
        {
            if(b[i].GetLinearVelocity() < 2.0)
            {
                isDone = false;
            }
        }

        if(isDone && this.birdSprite.body && this.birdSprite.body.GetLinearVelocity().length < 2.0)
        {
            cc.log("is done.");
        }
        else
        {
            cc.log("NOT");
        }
        /*if(b2.bodies)
        {
            for(i=0;i<b2.bodies.length;i++)
            {
                b2.bodies[i];
            }
        }*/
    }   ,
    update: function (dt) {
        b2.simulate();
        this.freeze();

        if (this.birdSprite.body) {
            var bData = this.birdSprite.body.GetUserData();
            cc.log("Velocity is " + this.birdSprite.body.GetLinearVelocity().Length()) ;
            if (!bData || bData.isContacted) return;

            var birdPos = this.birdSprite.getPosition(),
                vector = cc.pSub(birdPos, (this.lastSmoke && this.lastSmoke.getPosition()) || cc.p(0, 0)),
                length = cc.pLength(vector);

            if (length >= this.smokeDistance) {
                this.lastSmoke = this.addObject({
                    name: "smoke",
                    x: birdPos.x,
                    y: birdPos.y,
                    scale: Math.random() >= 0.5 ? 0.8 : 0.6
                });
            }
            //if(this.birdSprite.body.velocity)
        }
        else
        {
            var i=1;
        }
    },
    onTouchesBegan: function (touch, evt) {
        this.menus.forEach(function (menu) {
            menu.handleTouches(touch, evt);
        });

        var currPoint = touch[0].getLocation(),
            vector = cc.pSub(this.birdStartPos, currPoint);

        if ((this.isDraggingSling = (cc.pLength(vector) < this.slingRadius.max)) && !this.birdSprite.body && !this.slingRubber3) {
            this.slingRubber3 = this.addObject({
                name: "sling3",
                x: currPoint.x,
                y: currPoint.y,
                scaleY: 1.5,
                scaleX: 2,
                anchor: cc.p(0, 0.5),
                z: 1
            });
        }
    },
    onTouchesMoved: function (touch, evt) {
        this.menus.forEach(function (menu) {
            menu.handleTouchesMoved(touch, evt);
        });

        if (!this.isDraggingSling || this.birdSprite.body) return;

        var currPoint = touch[0].getLocation(),
            vector = cc.pSub(currPoint, this.birdStartPos),
            radius = cc.pLength(vector),
            angle = cc.pToAngle(vector);

        angle = angle < 0 ? (Math.PI * 2) + angle : angle;
        radius = MathH.clamp(radius, this.slingRadius.min, this.slingRadius.max);
        if (angle <= this.slingAngle.max && angle >= this.slingAngle.min) {
            radius = this.slingRadius.min;
        }

        this.birdSprite.setPosition(cc.pAdd(this.birdStartPos, cc.p(radius * Math.cos(angle), radius * Math.sin(angle))));

        var updateRubber = function (rubber, to, lengthAddon, topRubber) {
            var from = rubber.getPosition(),
                rubberVec = cc.pSub(to, from),
                rubberAng = cc.pToAngle(rubberVec),
                rubberDeg = cc.RADIANS_TO_DEGREES(rubberAng),
                length = cc.pLength(rubberVec) + (lengthAddon || 8);

            rubber.setRotation(-rubberDeg);
            rubber.setScaleX(-(length / rubber.getContentSize()
                .width));

            if (topRubber) {
                rubber.setScaleY(1.1 - ((0.7 / this.slingRadius.max) * length));
                this.slingRubber3.setRotation(-rubberDeg);
                this.slingRubber3.setPosition(cc.pAdd(from, cc.p((length) * Math.cos(rubberAng), (length) * Math.sin(rubberAng))));
            }
        } .bind(this);

        var rubberToPos = this.birdSprite.getPosition();
        updateRubber(this.slingRubber2, rubberToPos, 13, true);
        updateRubber(this.slingRubber1, rubberToPos, 0);
        this.slingRubber1.setScaleY(this.slingRubber2.getScaleY());
    },
    onTouchesEnded: function (touch, evt) {
        this.menus.forEach(function (menu) {
            menu.handleTouchesEnded(touch, evt);
        });

        if (!this.birdSprite.body && this.isDraggingSling) {
            this.slingRubber1.setVisible(false);
            this.slingRubber2.setVisible(false);
            this.slingRubber3.setVisible(false);

            b2.enablePhysicsFor({
                type: "dynamic",
                shape: "circle",
                sprite: this.birdSprite,
                density: 15,
                restitution: 0.4,
                userData: new BodyUserData(GameObjectRoll.Bird, 99999)//250)
            });

            var vector = cc.pSub(this.birdStartPos, this.birdSprite.getPosition()),
                impulse = cc.pMult(vector, 12),
                bPos = this.birdSprite.body.GetWorldCenter();

            this.birdSprite.body.ApplyImpulse(impulse, bPos);

            this.isDraggingSling = false;
        }
    },
    onKeyUp: function (e) { },
    onKeyDown: function (e) { }
});


// ---- SCENE
GameLayer.create = function () {
    var sg = new GameLayer();
    if (sg && sg.init()) {
        return sg;
    }
    return null;
};

GameLayer.scene = function () {
    var scene = cc.Scene.create();
    var layer = GameLayer.create();
    scene.addChild(layer, 1);
    return scene;
};

