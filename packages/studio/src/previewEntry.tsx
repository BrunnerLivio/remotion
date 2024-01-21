import React from 'react';
import type {render} from 'react-dom';
import ReactDOM from 'react-dom/client';
import {Internals} from 'remotion';
import '../styles/styles.css';
import {NoRegisterRoot} from './components/NoRegisterRoot';
import {Studio} from './components/Studio';

Internals.CSSUtils.injectCSS(
	Internals.CSSUtils.makeDefaultCSS(null, '#1f2428'),
);

let root: ReturnType<typeof ReactDOM.createRoot> | null = null;

const getRootForElement = () => {
	if (root) {
		return root;
	}

	root = ReactDOM.createRoot(Internals.getPreviewDomElement() as HTMLElement);
	return root;
};

const renderToDOM = (content: React.ReactElement) => {
	// @ts-expect-error
	if (ReactDOM.createRoot) {
		getRootForElement().render(content);
	} else {
		(ReactDOM as unknown as {render: typeof render}).render(
			content,
			Internals.getPreviewDomElement(),
		);
	}
};

renderToDOM(<NoRegisterRoot />);

Internals.waitForRoot((NewRoot) => {
	renderToDOM(<Studio rootComponent={NewRoot} />);
});