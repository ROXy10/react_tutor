window.ee = new EventEmitter();

var my_news = [
    {
        author: 'Саша Печкин',
        text: 'В четчерг, четвертого числа...',
        bigText: 'Далеко-далеко за словесными горами в стране, гласных и согласных живут рыбные тексты. Парадигматическая до предупредила жизни встретил вопрос, которой запятых коварных дорогу.'
    },
    {
        author: 'Просто Вася',
        text: 'Считаю, что $ должен стоить 35 рублей!',
        bigText: 'Далеко-далеко за словесными горами в стране, гласных и согласных живут рыбные тексты. Парадигматическая до предупредила жизни встретил вопрос, которой запятых коварных дорогу.'
    },
    {
        author: 'Гость',
        text: 'Бесплатно. Скачать. Лучший сайт - http://localhost:3000',
        bigText: 'Далеко-далеко за словесными горами в стране, гласных и согласных живут рыбные тексты. Парадигматическая до предупредила жизни встретил вопрос, которой запятых коварных дорогу.'
    }
];

var Article = React.createClass({
    propTypes: {
        data: React.PropTypes.shape({
            author: React.PropTypes.string.isRequired,
            text: React.PropTypes.string.isRequired,
            bigText: React.PropTypes.string.isRequired,
        })
    },
    getInitialState: function () {
        return {
            visible: false
        };
    },
    readmoreClick: function (e) {
        e.preventDefault();
        this.setState({visible: true});
        // this.setState({visible:false}, function(){
        // 	alert('Состояние изменилось')
        // });
    },
    render: function () {
        var author = this.props.last_news.author,
            text = this.props.last_news.text,
            bigText = this.props.last_news.bigText,
            visible = this.state.visible;
        return (
            <div className="article">
                <p className="news__author">{author}</p>
                <p className="news__text">{text}</p>
                <a href="#"
                   onClick={this.readmoreClick}
                   className={"news__readmore " + (visible ? 'none' : '')}>
                    Подробнее
                </a>
                <p className={"news__big-text " + (visible ? '' : 'none')}>{bigText}</p>
            </div>
        )
    },
})

var News = React.createClass({
    propTypes: {
        last_news: React.PropTypes.array.isRequired
    },
    getInitialState: function () {
        return {
            counter: 0
        }
    },
    onTotalNewsClick: function () {
        this.setState({counter: ++this.state.counter});
    },
    render: function () {
        var last_news = this.props.last_news;
        var newsTemplate;

        if (last_news.length > 0) {
            newsTemplate = last_news.map(function (item, index) {
                return (
                    <div key={index}>
                        <Article last_news={item}/>
                    </div>
                )
            })
        } else {
            newsTemplate = <p>К сожалению новостей нет!</p>
        }
        return (
            <div className="news">
                {newsTemplate}
                <strong
                    className={'news__count ' + (last_news.length > 0 ? '' : 'none') }
                    onClick={this.onTotalNewsClick}>
                    Всего новостей: {last_news.length}</strong>
            </div>
        );
    }
});

var TestInput = React.createClass({
    // getInitialState: function () {
    //     return {
    //         myValue: ''
    //     }
    // },
    // onChangeHandler: function (e) {
    //     this.setState({myValue: e.target.value})
    // },

    componentDidMount: function () {
        ReactDOM.findDOMNode(this.refs.myTestInput).focus();
    },
    componentWillReceiveProps: function (nextProps) {
        this.setState({
            likesIncreasing: nextProps.likeCount > this.props.likeCount
        });
    },
    onBtnClickHandler: function (e) {
        alert(ReactDOM.findDOMNode(this.refs.myTestInput).value);
    },
    render: function () {
        return (
            <div>
                <input
                    className='test-input'
                    defaultValue=''
                    placeholder='ведите значение'
                    ref='myTestInput'/>
                <button onClick={this.onBtnClickHandler} ref="alert_button">Показать значение</button>
            </div>
        );
    }
});

var Add = React.createClass({
    getInitialState: function () {
        return {
            agreeNotChecked: true,
            authorIsEmpty: true,
            textIsEmpty: true
        }
    },
    componentDidMount: function () {
        ReactDOM.findDOMNode(this.refs.author).focus();
    },
    onBtnClickHandler: function (e) {
        e.preventDefault();
        var textEl = ReactDOM.findDOMNode(this.refs.text);
        var author = ReactDOM.findDOMNode(this.refs.author).value;
        var text = ReactDOM.findDOMNode(this.refs.text).value;

        var item = [{
            author: author,
            text: text,
            bigText: '...'
        }];
        window.ee.emit('News.add', item);
        textEl.value = '';
        this.setState({textIsEmpty: true});
    },
    onCheckRuleClick: function (e) {
        this.setState({agreeNotChecked: !this.state.agreeNotChecked});
    },
    onFieldChange: function (fieldName, e) {
        var next = {};
        if (e.target.value.trim().length>0) {
            next[fieldName] = false;
            this.setState(next);
        } else {
            next[fieldName] = true;
            this.setState(next);
        }
    },
    render: function () {
        var agreeNotChecked = this.state.agreeNotChecked,
            authorIsEmpty = this.state.authorIsEmpty,
            textIsEmpty = this.state.textIsEmpty;
        return (
            <form className="add cf">
                <input
                    type="text"
                    className="add__author"
                    onChange={this.onFieldChange.bind(this, 'authorIsEmpty')}
                    defaultValue=''
                    placeholder="Ваше имя"
                    ref="author"
                />
                <textarea
                    className="add__text"
                    onChange={this.onFieldChange.bind(this,'textIsEmpty')}
                    defaultValue=''
                    placeholder="Текст новости"
                    ref="text">
                </textarea>
                <label className="add__checkrule">
                    <input type="checkbox" ref="checkrule" onChange={this.onCheckRuleClick}/>Я согласен с правилами
                </label>
                <button
                    className="add_btn"
                    onClick={this.onBtnClickHandler}
                    ref="alert_button"
                    disabled={agreeNotChecked || authorIsEmpty || textIsEmpty}>
                    Добавить новость
                </button>
            </form>
        );
    }
});

var App = React.createClass({
    getInitialState: function () {
        return {
            news: my_news
        };
    },
    componentDidMount: function () {
        var self = this;
        window.ee.addListener('News.add', function (item) {
            var nextNews = item.concat(self.state.news);
            self.setState({news: nextNews});
        });
    },
    componentWillUnmount: function () {
        window.ee.removeListener('News.add');
    },
    render: function () {
        return (
            <div className='app'>
                {/*<TestInput />*/}
                <Add />
                <h3>Новости</h3>
                <News last_news={this.state.news}/>
            </div>
        );
    }
});

ReactDOM.render(
    <App />,
    document.getElementById('root')
);