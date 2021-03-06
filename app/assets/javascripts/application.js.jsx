// This is a manifest file that'll be compiled into application.js, which will include all the files
// listed below.
//
// Any JavaScript/Coffee file within this directory, lib/assets/javascripts, vendor/assets/javascripts,
// or any plugin's vendor/assets/javascripts directory can be referenced here using a relative path.
//
// It's not advisable to add code directly here, but if you do, it'll appear at the bottom of the
// compiled file. JavaScript code in this file should be added after the last require_* statement.
//
// Read Sprockets README (https://github.com/rails/sprockets#sprockets-directives) for details
// about supported directives.
//
// = require react
// = require react_ujs
// = require_tree .
//= require components

'use	strict';
var	my_news	=	[
		{
				author:	'Саша	Печкин',
				text:	'В	четчерг,	четвертого	числа...',
				bigText:	'в	четыре	с	четвертью	часа	четыре	чёрненьких	чумазеньких	чертёнка	чертили	чёрными	чернилами	чертёж.'
		},
		{
				author:	'Просто	Вася',
				text:	'Считаю,	что	$	должен	стоить	35	рублей!',
				bigText:	'А	евро	42!'
		},
		{
				author:	'Гость',
				text:	'Бесплатно.	Скачать.	Лучший	сайт	-	http://localhost:3000',
				bigText:	'На	самом	деле	платно,	просто	нужно	прочитать	очень	длинное	лицензионноесоглашение'
		}
];
window.ee	=	new	EventEmitter();
var	Article	=	React.createClass({
 	  propTypes:	{
 					  data:	React.PropTypes.shape({
 						author:	React.PropTypes.string.isRequired,
 						text:	React.PropTypes.string.isRequired,
 						bigText:	React.PropTypes.string.isRequired
 				})
 		},
 		getInitialState:	function()	{
 				return	{
 						visible:	false
 				};
 		},
 		readmoreClick:	function(e)	{
 				e.preventDefault();
 				this.setState({visible:	true});
 		},
 		render:	function()	{
 				var	author	=	this.props.data.author,
 						text	=	this.props.data.text,
 						bigText	=	this.props.data.bigText,
 						visible	=	this.state.visible;
 				return	(
 						<div	className='panel panel-default panel-primary'>
 								<p	className='panel-heading panel-title'>{author}:</p>
 								<p	className='panel-body'>{text}</p>
 								<div className={'panel-footer '+(visible ? 'none':	'')}><a href="" onClick={this.readmoreClick} className={'news__readmore'}>Подробнее</a></div>
 								<p	className={'panel-body	'	+	(visible	?	'':	'none')}>{bigText}</p>
 						</div>
 				)
 		}
 });
var	News	=	React.createClass({
		propTypes:	{
				data:	React.PropTypes.array.isRequired
		},
		getInitialState:	function()	{
				return	{
						counter:	0
				}
		},
		render:	function()	{
				var	data	=	this.props.data;
				var	newsTemplate;
				if	(data.length	>	0)	{
						newsTemplate	=	data.map(function(item,	index)	{
								return	(
										<div	key={index}>
												<Article	data={item}	/>
										</div>
								)
						})
				}	else	{
						newsTemplate	=	<p>К	сожалению	новостей	нет</p>
				}
				return	(
						<div	className='news'>
								{newsTemplate}
								<strong
										className={'news__count	'	+	(data.length	>	0	?	'':'none')	}>Всего	новостей:	{
data.length}</strong>
						</div>
				);
		}
});
var	Add	=	React.createClass({
		getInitialState:	function()	{
				return	{
						agreeNotChecked:	true,
						authorIsEmpty:	true,
						textIsEmpty:	true
				};
		},
		componentDidMount:	function()	{
				ReactDOM.findDOMNode(this.refs.author).focus();
		},
		onBtnClickHandler:	function(e)	{
				e.preventDefault();
				var	textEl	=	ReactDOM.findDOMNode(this.refs.text);
				var	author	=	ReactDOM.findDOMNode(this.refs.author).value;
				var	text	=	textEl.value;
				var	item	=	[{
						author:	author,
						text:	text,
						bigText:	'...'
				}];
				window.ee.emit('News.add',	item);
				textEl.value	=	'';
				this.setState({textIsEmpty:	true});
		},
		onCheckRuleClick:	function(e)	{
				this.setState({agreeNotChecked:	!this.state.agreeNotChecked});
		},
		onFieldChange:	function(fieldName,	e)	{
				if	(e.target.value.trim().length	>	0)	{
						this.setState({[''+fieldName]:false})
				}	else	{
						this.setState({[''+fieldName]:true})
				}
		},
		render:	function()	{
				var	agreeNotChecked	=	this.state.agreeNotChecked,
								authorIsEmpty	=	this.state.authorIsEmpty,
								textIsEmpty	=	this.state.textIsEmpty;
				return	(
						<form	className='add	cf'>
							  <h3>Добавить новость</h3>
								<input
										type='text'
										className='add__author'
										onChange={this.onFieldChange.bind(this,	'authorIsEmpty')}
										placeholder='Ваше	имя'
										ref='author'
								/>
								<textarea
										className='add__text'
										onChange={this.onFieldChange.bind(this,	'textIsEmpty')}
										placeholder='Текст	новости'
										ref='text'
								></textarea>
								<label	className='add__checkrule'>
										<input	type='checkbox'	ref='checkrule'	onChange={this.onCheckRuleClick}/>Я	согласен	с	правилами
								</label>
								<button
										className='add__btn'
										onClick={this.onBtnClickHandler}
										ref='alert_button'
										disabled={agreeNotChecked	||	authorIsEmpty	||	textIsEmpty}
										>
										Опубликовать	новость
								</button>
						</form>
				);
		}
});
var	App	=	React.createClass({
		getInitialState:	function()	{
				return	{
						news:	my_news
				};
		},
		componentDidMount:	function()	{
				var	self	=	this;
				window.ee.addListener('News.add',	function(item)	{
						var	nextNews	=	item.concat(self.state.news);
						self.setState({news:	nextNews});
				});
		},
		componentWillUnmount:	function()	{
				window.ee.removeListener('News.add');
		},
		render:	function()	{
				console.log('render');
				return	(
						<div	className='app'>
								<Add	/>
								<h3>Новости</h3>
								<News	data={this.state.news}	/>
						</div>
				);
		}
});
ReactDOM.render(
		<App	/>,
		document.getElementById('root')
		);
