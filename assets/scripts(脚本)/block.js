import colors from 'colors';
cc.Class({
    extends: cc.Component,

    properties: {
       //block是一个根节点，只需要修改颜色和文字，颜色和文字已经定义好了，所以不需要声明block。但是下面一个lable文字还未声明，所以只要声明Lab了就ok了
       numberLable:cc.Label
       
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    start () {

    },

    //建立一个参数值，传入参数使number的数字可以改变，且根据数字更改小格子的颜色，若数字为0，则鸽子颜色就是原始的背景色且无文字。
    setNumber (number) {
        if(number==0){
            this.numberLable.node.active = false;//如果number等于0，则这个numberLable的节点的属性设置为false，其他情况下为true   
        }
        this.numberLable.string = number;//number即小格子的文字的变化根据设置好的number的属性去改变

        if(number in colors){//确保变化的数字在colors定义的里面，这样才能随着数字的变化然后颜色随number变化
            this.node.color = colors[number];//根据colors.js这个函数，前面数字的变化根据“ = ”后面的颜色值去取小格子的颜色
        }
        
    },
    // update (dt) {},
});
