var s_resourceDirectory = "";
var s_imageDirectory = "";
var s_musicDirectory = "";
var s_soundDirectory = "";
var s_levelDirectory = "";
var s_plistDirectory = "";

var dirImg = "";
var dirMusic = "";
var musicSuffix = ".mp3";
var imageSuffix = ".png";
if( cc.config.deviceType == 'browser') {
    s_resourceDirectory = "res/";
    s_levelDirectory = s_resourceDirectory + "level/";
    s_musicDirectory = s_resourceDirectory + "music/";
    s_soundDirectory = s_resourceDirectory + "sound/";
    s_imageDirectory = s_resourceDirectory + "image/";
    s_plistDirectory = s_resourceDirectory + "image/";
    musicSuffix = "";
    imageSuffix = ".png";
}

//images
var s_image_empty = s_imageDirectory + "empty" + imageSuffix;
var s_image_background = s_imageDirectory + "bg" + imageSuffix;
var s_image_menu_refresh = s_imageDirectory + "menu_refresh" + imageSuffix;
var s_image_menu_back = s_imageDirectory + "menu_back" + imageSuffix;

var s_image_platform = s_imageDirectory + "platform" + imageSuffix;
var s_image_bird = s_imageDirectory + "bird" + imageSuffix;
var s_image_enemy = s_imageDirectory + "enemy" + imageSuffix;
var s_image_sling1 = s_imageDirectory + "sling1" + imageSuffix;
var s_image_sling2 = s_imageDirectory + "sling2" + imageSuffix;
var s_image_sling3 = s_imageDirectory + "sling3" + imageSuffix;
var s_image_ground = s_imageDirectory + "ground" + imageSuffix;
var s_image_wood1 = s_imageDirectory + "wood1" + imageSuffix;
var s_image_wood2 = s_imageDirectory + "wood2" + imageSuffix;
var s_image_smoke = s_imageDirectory + "smoke" + imageSuffix;

//music
var s_music_theme = s_musicDirectory + "theme" + musicSuffix;

//sound effects
var s_sound_shot = s_soundDirectory + "shot" + musicSuffix;


var g_resources = (function () {
    var retval = [],
        images = [
            s_image_empty,
            s_image_background, 
            s_image_menu_refresh,
            s_image_menu_back,
            s_image_platform, 
            s_image_bird, 
            s_image_enemy, 
            s_image_sling1,
            s_image_sling2,
            s_image_sling3,
            s_image_ground,
            s_image_wood1,
            s_image_wood2,
            s_image_smoke
        ],
        music = [
            s_music_theme
        ],
        effect = [
            s_sound_shot
        ],
        plist = [];

    for (var i = 0; i < images.length; i++) {
        retval.push({
            type: "image",
            src: images[i]
        });
    }

    for (var i = 0; i < music.length; i++) {
        retval.push({
            type: "bgm",
            src: music[i]
        });
    }

    for (var i = 0; i < effect.length; i++) {
        retval.push({
            type: "effect",
            src: effect[i]
        });
    }

    for (var i = 0; i < plist.length; i++) {
        retval.push({
            type: "plist",
            src: s_plistDirectory + effect[i] + 'plist'
        });
    }

    return retval;
}());