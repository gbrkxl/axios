/**
 * 自定义promise
 */
(function(window){
    const PENDING = 'pending'
    const RESOLVED = 'resolved'
    const REJECTED = 'rejected'


    // 定义Promise构造函数
    function Promise(excutor){
        const that = this
        that.status = PENDING
        that.data = undefined
        that.callbacks = []
        //定义resolve方法
        function resolve(value){
            if(that.status !== PENDING) return //判定状态

            that.status = RESOLVED
            that.data = value
            if(that.callbacks.length){
                //异步调用
                setTimeout(()=>{
                    that.callbacks.forEach((objs)=>{
                        objs.onResolved(that.data)
                    })
                })
            } 
        }

        //定义reject方法
        function reject(reason){
            if(that.status !== PENDING) return //判定状态

            that.status = REJECTED
            that.data = reason
            if(that.callbacks.length){
                //异步调用
                setTimeout(()=>{
                    that.callbacks.forEach((objs)=>{
                        objs.onRejected(that.data)
                    })
                })
            }    
        }

        //调用构造器函数
        try{
            excutor(resolve,reject)
        }catch(error){
            reject(error)
        }
    }

    //定义then方法
    Promise.prototype.then = function(onResolved,onRejected){
        const that = this
        onResolved = typeof onResolved === 'function' ? onResolved : value => value
        onRejected = typeof onRejected === 'function' ? onRejected : reason => {throw reason}

        return new Promise((resolve,reject)=>{
            //判断then的返回值
            function handle(callback){
                try{
                    let result = callback(that.data)
                    // console.log(result)
                    if(result instanceof Promise){
                        // result.then(
                        //     value => resolve(value),
                        //     reason => resolve(reason)
                        // )
                        result.then(resolve,reject)
                    }else{
                        resolve(result)
                    }
                }catch(error){
                    reject(error)
                }
            }
            //判断promise的状态
            if(that.status === PENDING){
                that.callbacks.push({
                    onResolved(){
                        handle(onResolved)
                    },
                    onRejected(){
                        handle(onRejected)
                    }
                })
            }else if(that.status === RESOLVED){
                setTimeout(()=>{
                    handle(onResolved)
                })
            }else if(that.status === REJECTED){
                setTimeout(()=>{
                    handle(onRejected)
                })
            }
        })
        
    }   

    //定义catch方法
    Promise.prototype.catch = function(onRejected){
        return this.then(undefined,onRejected)
    }

    Promise.resolve = function(value){
        return new Promise((resolve,reject)=>{
            if(value instanceof Promise){
                value.then(resolve,reject)
            }else{
                resolve(value)
            }
        })
    }

    Promise.reject = function(reason){
        return new Promise((resolve,reject)=>{
            reject(reason)
        })
    }

    window.Promise = Promise
})(window)