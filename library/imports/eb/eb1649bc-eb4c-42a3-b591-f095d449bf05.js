"use strict";
cc._RF.push(module, 'eb164m860xCo7WR8JXUSb8F', 'game');
// scripts(脚本)/game.js

'use strict';

var ROWS = 4; //在外设定航高数量，之后需要修改就在ROWS后修改行高数就可以，里面的行高数定义为ROWS

cc.Class({
    extends: cc.Component,

    properties: {
        scoreLabel: cc.Label,
        score: 0, //得分
        blockPrefab: cc.Prefab,
        gap: 20, //间隔
        bg: cc.Node
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    start: function start() {
        this.drawBgBlocks();
        this.init(); //初始化【分数归零，清空所有块】
    },
    drawBgBlocks: function drawBgBlocks() {
        this.blockSize = (cc.winSize.width - this.gap * (ROWS + 1)) / ROWS; //第一个小格子
        var x = this.gap + this.blockSize / 2; //X轴的坐标
        var y = this.blockSize; //Y轴的大概坐标

        //声明一个数组，把每个格子的位置的储存记起来，之后需要插入/移动到哪个格子的前后左右就不用再去计算一次
        this.positions = [];
        //绘制剩下的格子，把4x4格子的属性写进去一个for循环里面,生成4x4的小格子
        for (var i = 0; i < ROWS; ++i) {
            this.positions.push([0, 0, 0, 0]); //声明数组的值
            for (var j = 0; j < ROWS; ++j) {
                var block = cc.instantiate(this.blockPrefab); //画出第一个小格子
                block.width = this.blockSize;
                block.height = this.blockSize; //修改小格子的大小
                this.bg.addChild(block); //添加小格子
                block.setPosition(cc.p(x, y)); //确定小格子的位置，这是第一个小格子确定的位置
                this.positions[i][j] = cc.p(x, y); //记下小格子的位置坐标
                x += this.gap + this.blockSize; //N个新的小格子新生成的x轴的位置【即一个gap空隙＋一个小格子=新的小格子】
                //敲好block.js的代码之后，回来game.js[即此处↓]设置block
                block.getComponent('block').setNumber(0); //获得block.js里面设置的属性，并且定初始数字为0        
            }
            y += this.gap + this.blockSize; //N个新的小格子新生成的y轴的位置【即一个gap空隙＋一个小格子=新的小格子】

            //画完x轴的小格子后画y轴的，要回到原始的左下角开始往上画，所以定义X回到原始位置
            x = this.gap + this.blockSize / 2;
        }
    },
    init: function init() {
        this.updateScore(0);

        //把现有的块清掉，即游戏后有颜色的块变为初始化
        //首先先判断是否为空值
        if (this.blocks) {
            for (var i = 0; i < this.blocks.length; ++i) {
                for (var j = 0; j < this.blocks[i].length; ++j) {
                    if (this.blocks[i][j] != null) {
                        this.blocks[i][j].destroy();
                    }
                }
            }
        }

        this.data = []; //data内储存每个block里面的数字，没有挂钩节点，直接清掉
        this.blocks = []; //新建数组
        //初始化data和blocks
        for (var _i = 0; _i < ROWS; ++_i) {
            this.blocks.push([null, null, null, null]);
            this.data.push([0, 0, 0, 0]);
        }
    },


    //分数清零初始化
    updateScore: function updateScore(number) {
        this.score = number;
        this.scoreLabel.string = '分数:' + number;
    }
});

cc._RF.pop();