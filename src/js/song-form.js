{
    let view = {
        el: '.page > main',
        init() {
            this.$el = $(this.el)
        },
        template: `
        <h1>新建歌曲</h1>
        <form class="form">
            <div class="row">
                <label>
                    歌名
                </label>
                    <input name="name" type="text" value="__key__">
            </div>
            <div class="row">
                <label>
                    歌手
                </label>
                    <input name="singer" type="text">
            </div>
            <div class="row">
                <label>
                    外链
                </label>
                    <input name="url" type="text" value="__link__">
            </div>
            <div class="row actions">
                <button type="submit">保存</button>
            </div>
        </form>
        `,
        render(data = {}) {
            let placeholders = ['key', 'link']
            let html = this.template
            placeholders.map((string) => {
                html = html.replace(`__${string}__`, data[string] || '')
            })
            $(this.el).html(html)
        }
    }
    let model = {
        data: {
            name: '',
            singer: '',
            url: '',
            id: ''
        },
        create(data) {
            // 声明 class
            var Song = AV.Object.extend('Song');

            // 构建对象
            var song = new Song();

            // 为属性赋值
            song.set('name', data.name);
            song.set('singer', data.singer);
            song.set('url', data.url);

            // 将对象保存到云端
            song.save().then(function (newSong) {
                // 成功保存之后，执行其他逻辑
                console.log(newSong);
            }, function (error) {
                console.log(error)
                // 异常处理
            });
        }

    }
    let controller = {
        init(view, model) {
            this.view = view
            this.view.init()
            this.model = model
            this.view.render(this.model.data)
            this.bindEvents()
            window.eventHub.on('upload', (data) => {
                this.view.render(data)
            })
        },
        bindEvents() {
            this.view.$el.on('submit', 'form', (e) => {
                e.preventDefault()
                let needs = 'name singer url'.split(' ')
                let data = {}
                needs.map((string) => {
                    data[string] = this.view.$el.find(`[name="${string}"]`).val()
                })
                this.model.create(data)
                console.log(data)
            })
        }
    }
    controller.init(view, model)
}