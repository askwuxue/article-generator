// 实现一个拦截器

class Interceptor {
  constructor() {
    // 存放注册的异步函数
    this.aspects = [];
  }
  // 注册,注册的是一个async 函数
  use(aspect) {
    this.aspects.push(aspect);
    return this;
  }
  // 执行注册的async 函数
  async run(ctx) {
    const aspects = this.aspects;
    // 将注册的async 函数包裹成一个洋葱模型
    // 先注册的函数在外层，后注册的函数在内层
    const onion = aspects.reduceRight((next, current) => {
      return async () => {
        await current(ctx, next);
      }
    }, () => Promise.resolve());

    try {
      onion()
    } catch (error) {
      throw new Error('error');
    }

    return ctx;
  }
}

function wait(ms) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
};

const task = function(id) {
  return async (ctx, next) => {
    console.log(`task ${id} begin`);
    ctx.count++;
    await wait(1000);
    console.log(`count: ${ctx.count}`);
    await next();
    console.log(`task ${id} end`);
  };
};

// const inter = new Interceptor();

// 将多个任务以拦截切面的方式注册到拦截器中
// inter.use(task(0));
// inter.use(task(1));
// inter.use(task(2));
// inter.use(task(3));
// inter.use(task(4));

// 从外到里依次执行拦截切面
// inter.run({count: 0});


export default Interceptor;