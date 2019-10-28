const ROWS = 4;//在外设定行高数量，之后需要修改就在ROWS后修改行高数就可以，里面的行高数定义为ROWS
const NUMBERS = [2,4];//随机生成2或者4的值的数字块并且插入游戏里【在这里设置，之后下面修改容易】
const MIN_LENGTH = 50;//最起码拖动格子的长度
const MOVE_DURATION = 0.1;//格子的移动设定时间

cc.Class({
    extends: cc.Component,

    properties: {
        scoreLabel:cc.Label,
        score:0,//得分
        blockPrefab:cc.Prefab,
        gap:20,//间隔
        bg:cc.Node,
        overPanel:cc.Node,
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    start () {
        this.drawBgBlocks();
        this.init();//初始化【分数归零，清空所有块】
        this.addEventHandler();//事件监听：在游戏中拖动块时能够辨别方向

    },

    drawBgBlocks () {
        this.blockSize= (cc.winSize.width - this.gap * (ROWS+1)) / ROWS;//第一个小格子
        let x = this.gap + this.blockSize / 2;//X轴的坐标
        let y = this.blockSize + this.blockSize / 2;//Y轴的大概坐标
        
        //声明一个数组，把每个格子的位置的储存记起来，之后需要插入/移动到哪个格子的前后左右就不用再去计算一次
        this.positions=[];        
        //绘制剩下的格子，把4x4格子的属性写进去一个for循环里面,生成4x4的小格子
        for (let i = 0; i < ROWS; ++i){
            this.positions.push([0,0,0,0]);//声明数组的值
            for(let j = 0; j < ROWS; ++j){
                let block=cc.instantiate(this.blockPrefab);//画出第一个小格子
                block.width=this.blockSize;
                block.height=this.blockSize;//修改小格子的大小
                this.positions[i][j] = block;
                this.bg.addChild(block);//添加小格子
                block.setPosition(cc.v2(x,y));//确定小格子的位置，这是第一个小格子确定的位置
                this.positions[i][j]=cc.v2(x,y);//记下小格子的位置坐标
                x +=this.gap + this.blockSize;//N个新的小格子新生成的x轴的位置【即一个gap空隙＋一个小格子=新的小格子】
                //敲好block.js的代码之后，回来game.js[即此处↓]设置block
                block.getComponent('block').setNumber(0);//获得block.js里面设置的属性，并且定初始数字为0        
            }
            y += this.gap + this.blockSize;//N个新的小格子新生成的y轴的位置【即一个gap空隙＋一个小格子=新的小格子】

            //画完x轴的小格子后画y轴的，要回到原始的左下角开始往上画，所以定义X回到原始位置
            x =this.gap + this.blockSize / 2;
        }
    
    },

    //初始化
    init(){
        // this.overPanel.active=false;
        this.updateScore(0);

        //把现有的块清掉，即游戏后有颜色的块变为初始化
        //首先先判断是否为空值
        if(this.blocks){
            for (let i=0; i<this.blocks.length; ++i){
                for (let j=0; j<this.blocks[i].length; ++j){
                    if (this.blocks[i][j] !=null){
                        this.blocks[i][j].destroy();
                    }
                }
            }

        }

        this.data=[];//data内储存每个block里面的数字，没有挂钩节点，直接清掉
        this.blocks=[];//新建数组
        //初始化data和blocks
        for (let i=0; i<ROWS; ++i){
            this.blocks.push([null,null,null,null]);
            this.data.push([0,0,0,0]);
        }

        //开始时新添加三个块
        this.addBlock();
        this.addBlock();
        this.addBlock();
    },

    //分数清零初始化，更新分数
    updateScore(number){
        this.score = number;
        this.scoreLabel.string = 'SCORE:' + number;
    },

    //在游戏时，添加的块需要先找出空的位置插入【排查空隙】
    getEmptyLocations(){
        let locations = [];//新建一个空的数组，如果已经满格，就排查出一个空的位置
        for(let i=0; i<this.blocks.length; ++i){
            for(let j=0; j<this.blocks[i].length; ++j){
                if(this.blocks[i][j] == null){
                    // locations.push(i * ROWS + j);
                    locations.push({x: i,y: j});
                }
            }
        }

        return locations;
    },

    //在情况的时候，制定开始时就有三个块
    addBlock(){
        let locations=this.getEmptyLocations();

        //如果生成的格子是空值，就不要执行项目的代码，在获取代码之前return做一个排空的设置
        if (locations.length == 0) { return false };
        
        //随机抽出一个空闲的位置
        let index = locations[Math.floor(Math.random() * locations.length)];
        let x=index.x;//当前x的位置
        let y=index.y;

        let position=this.positions[x][y];//把上面定义好的positions取出来等于当前的想，y的位置

        let block=cc.instantiate(this.blockPrefab);//画出第一个小格子
        block.width=this.blockSize;
        block.height=this.blockSize;//修改小格子的大小
        this.bg.addChild(block);//添加小格子
        block.setPosition(position);//确定小格子的位置，这是第一个小格子确定的位置
        //敲好block.js的代码之后，回来game.js[即此处↓]设置block
        let number = NUMBERS[Math.floor(Math.random() * NUMBERS.length)];
        block.getComponent('block').setNumber(number);
        this.blocks[x][y] = block;
        this.data[x][y] = number;//119-122行:用block存储格子，放了格子的位置要记在data里面存储
        return true;
    },

    //处理事件监听：在游戏中拖动块时能够辨别方向。对Cocos上的bg以下的内容进行监听
    addEventHandler(){
         //滑动操作
        this.bg.on('touchstart', (event)=>{//对bg进行事件监听，(event)=>表示箭头函数
            this.startPoint = event.getLocation();//把起始的节点取出来
        });

        this.bg.on('touchend', (event)=>{
            this.touchEnd(event);
        });

        this.bg.on('touchcancel', (event)=>{
            this.touchEnd(event);
        });

         //键盘
         cc.systemEvent.on(cc.SystemEvent.EventType.KEY_UP, this.keyUp, this);

    },

    keyUp(event) {
        switch (event.keyCode) {
            case cc.macro.KEY.a:
                this.moveLeft(true);
                break;
            case cc.macro.KEY.d:
                this.moveLeft(false);
                break;
            case cc.macro.KEY.w:
                this.moveDown(false);
                break;
            case cc.macro.KEY.s:
                this.moveDown(true);
                break;
        }

    },

    touchEnd(event){
        this.endPoint = event.getLocation();//获取结束的节点

        let vec = this.endPoint.sub(this.startPoint);//计算向量

        //设置长度。即知点击块时不会产生方向的拖动，只有拖动大于设定的长度范围时，只产生方向
        if (vec.mag() > MIN_LENGTH) {
            //判断方向。拖动了一定长度之后，就响应水平还是垂直方向。水平还是垂直方向的左右方向再通过设定所得
            if (Math.abs(vec.x) > Math.abs(vec.y)) {
                //水平方向
                if (vec.x > 0) {
                    this.moveLeft(false);
                }else {
                    this.moveLeft(true);
                }
            }else{
                //垂直方向
                if (vec.y > 0) {
                    this.moveDown(false);
                }else {
                    this.moveDown(true);
                }
            }
        }
    },

    afterMove(){

    },

    /**
    * 移动格子。
    * @param {cc.Node} block 
    * @param {cc.p} position 
    * @param {function} callback 
    */
    doMove(block, position, callback){
        let action = cc.moveTo(MOVE_DURATION, position);
        let finish = cc.callFunc(() =>{
            // callback && callback()
            callback();
        });
        block.runAction(cc.sequence(action, finish));//doMove按顺序执行action和finish，finish完成无误之后才回调
    },

    moveLeft(){
        let move = (x, y, callback) =>{//完成之后使命结束，上报命令回调
            if (y == 0 || this.data[x][y] == 0){//何时到顶然后结束
                callback && callback();//表示移动完毕后回调上报
                return;
            }else if (this.data[x] [y-1] == 0){
                //移动
                //取当前块
                let block = this.blocks[x][y];
                let position = this.positions[x][y-1];
                //移动即让let block移动到let position上面,然后把之前的block的位置复原或者为空
                this.blocks[x][y-1] = block;
                this.data[x][y-1] = this.data[x][y];
                //当前位置置空
                this.data[x][y] = 0;
                this.blocks[x][y] = null;
                 //移动动画
                this.doMove(block, position, ()=>{
                    move(x, y-1, callback);
                })
            }else if (this.data[x] [y-1] == this.data[x][y]){//合并

            }else{
                callback && callback();
                return;
            }
        };
        let toMove = [];
        for (let i=0; i<ROWS; ++i){
            for (let j=0; j<ROWS; ++j){
                if (this.data[i][j] != 0) {//移动时，判断前面是否有空位/相同的数字格子；是否已经满格
                    toMove.push({x: i,y: j});
                }
            }
        };
        
        let counter = 0;
        for (let i=0; i<toMove.length; ++i){
            //其他格子使命完成之后，让还在等待中可以游戏的格子准备回调，符合命令的格子继续游戏
            move(toMove[i].x, toMove[i].y, ()=>{
                counter++;
                //合适结束.执行下面命令，即一排4x4的格子无法继续游戏时或等于游戏设定的长度时
                if (counter == toMove.length){
                    this.afterMove();
                }
            })
        }
    },

    moveRight(){
        
    },

    moveUp(){

    },

    moveDown(){

    },

});

