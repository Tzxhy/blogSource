import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById('root')
);

if ('serviceWorker' in navigator) {

	window.addEventListener('load', function() {
		navigator.serviceWorker.register('/web-tools/sw.js', {scope: '/web-tools/'})
			.then(function (registration) {
				console.log('registration: ', registration);
				// 注册成功
				console.log('ServiceWorker registration successful with scope: ', registration.scope);
			})
			.catch(function (err) {

				// 注册失败:(
				console.log('ServiceWorker registration failed: ', err);
			});
	})
}
