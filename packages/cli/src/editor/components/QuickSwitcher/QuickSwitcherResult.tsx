import React, {useEffect, useMemo, useRef, useState} from 'react';
import {getBackgroundFromHoverState, LIGHT_TEXT} from '../../helpers/colors';
import {useKeybinding} from '../../helpers/use-keybinding';
import {FilmIcon} from '../../icons/film';
import {StillIcon} from '../../icons/still';
import {Spacing} from '../layout';

type QuickSwitcherResultDetail = {
	type: 'composition';
	compositionType: 'composition' | 'still';
};

export type TQuickSwitcherResult = {
	title: string;
	id: string;
	onSelected: () => void;
} & QuickSwitcherResultDetail;

const container: React.CSSProperties = {
	paddingLeft: 16,
	paddingRight: 16,
	paddingTop: 3,
	paddingBottom: 3,
	display: 'flex',
	flexDirection: 'row',
	alignItems: 'center',
	cursor: 'pointer',
};

const label: React.CSSProperties = {
	flex: 1,
	whiteSpace: 'nowrap',
	textOverflow: 'ellipsis',
	overflow: 'hidden',
};

const iconStyle: React.CSSProperties = {
	width: 14,
	height: 14,
};

export const QuickSwitcherResult: React.FC<{
	result: TQuickSwitcherResult;
	selected: boolean;
}> = ({result, selected}) => {
	const [hovered, setIsHovered] = useState(false);
	const ref = useRef<HTMLDivElement>(null);
	const keybindings = useKeybinding();

	useEffect(() => {
		const {current} = ref;
		if (!current) {
			return;
		}

		const onMouseEnter = () => setIsHovered(true);
		const onMouseLeave = () => setIsHovered(false);

		current.addEventListener('mouseenter', onMouseEnter);
		current.addEventListener('mouseleave', onMouseLeave);

		return () => {
			current.removeEventListener('mouseenter', onMouseEnter);
			current.removeEventListener('mouseleave', onMouseLeave);
		};
	}, []);

	useEffect(() => {
		if (!selected) {
			return;
		}

		const binding = keybindings.registerKeybinding({
			key: 'Enter',
			callback: result.onSelected,
			commandCtrlKey: false,
			event: 'keydown',
		});

		return () => {
			binding.unregister();
		};
	}, [keybindings, result.onSelected, selected]);
	useEffect(() => {
		if (selected) {
			ref.current?.scrollIntoView({
				block: 'nearest',
				inline: 'center',
			});
		}
	}, [selected]);

	const style = useMemo(() => {
		return {
			...container,
			backgroundColor: getBackgroundFromHoverState({
				hovered,
				selected,
			}),
		};
	}, [hovered, selected]);

	const labelStyle = useMemo(() => {
		return {
			...label,
			color: selected || hovered ? 'white' : LIGHT_TEXT,
			fontSize: 15,
		};
	}, [hovered, selected]);

	return (
		<div ref={ref} key={result.id} style={style} onClick={result.onSelected}>
			{result.compositionType === 'still' ? (
				<StillIcon style={iconStyle} />
			) : (
				<FilmIcon style={iconStyle} />
			)}
			<Spacing x={1} />
			<div style={labelStyle}>{result.title}</div>
		</div>
	);
};
