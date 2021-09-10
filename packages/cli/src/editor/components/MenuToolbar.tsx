import React, {useCallback, useContext, useMemo, useState} from 'react';
import {FONT_FAMILY} from '../helpers/font';
import {ModalsContext} from '../state/modals';
import {MENU_ITEMS_CONTAINER} from './Menu/is-menu-click';
import {Menu, MenuId, MenuItem} from './Menu/MenuItem';

const row: React.CSSProperties = {
	alignItems: 'center',
	flexDirection: 'row',
	display: 'flex',
	color: 'white',
	borderBottom: '1px solid black',

	fontFamily: FONT_FAMILY,
	fontSize: 13,
	paddingLeft: 6,
};

type Structure = Menu[];

const openExternal = (link: string) => {
	window.open(link, '_blank');
};

export const MenuToolbar: React.FC = () => {
	const [selected, setSelected] = useState<MenuId | null>(null);
	const {setSelectedModal} = useContext(ModalsContext);

	const itemClicked = useCallback(
		(itemId: MenuId) => {
			setSelected(itemId);
		},
		[setSelected]
	);

	const itemHovered = useCallback(
		(itemId: MenuId) => {
			if (selected) {
				setSelected(itemId);
			}
		},
		[selected, setSelected]
	);

	const close = useCallback(() => {
		setSelected(null);
	}, []);

	const structure = useMemo((): Structure => {
		return [
			{
				id: 'remotion',
				label: 'Remotion',
				items: [
					{
						id: 'about',
						value: 'about',
						label: 'About Remotion',
						onClick: () => {
							close();
							openExternal('https://remotion.dev');
						},
						type: 'item',
						keyHint: null,
					},
					{
						id: 'changelog',
						value: 'changelog',
						label: 'Changelog',
						onClick: () => {
							close();
							openExternal('https://github.com/remotion-dev/remotion/releases');
						},
						type: 'item',
						keyHint: null,
					},
					{
						id: 'license',
						value: 'license',
						label: 'License',
						onClick: () => {
							close();
							openExternal(
								'https://github.com/remotion-dev/remotion/blob/main/LICENSE.md'
							);
						},
						type: 'item',
						keyHint: null,
					},
				],
			},
			{
				id: 'file',
				label: 'File',
				items: [
					{
						id: 'new-sequence',
						value: 'new-sequence',
						label: 'New composition...',
						onClick: () => {
							close();
							setSelectedModal('new-comp');
						},
						type: 'item',
						keyHint: 'N',
					},
					{
						id: 'new-still',
						value: 'new-still',
						label: 'New still...',
						onClick: () => {
							close();
							setSelectedModal('new-comp');
						},
						type: 'item',
						keyHint: null,
					},
					{
						id: 'render',
						value: 'render',
						label: 'Render',
						onClick: () => {
							close();
							// eslint-disable-next-line no-alert
							alert('todo');
						},
						type: 'item',
						keyHint: null,
					},
				],
			},
			{
				id: 'help',
				label: 'Help',
				items: [
					{
						id: 'docs',
						value: 'docs',
						label: 'Docs',
						onClick: () => {
							close();
							openExternal('https://remotion.dev/docs');
						},
						type: 'item',
						keyHint: null,
					},
					{
						id: 'file-issue',
						value: 'file-issue',
						label: 'File an issue',
						onClick: () => {
							close();
							openExternal(
								'https://github.com/remotion-dev/remotion/issues/new/choose'
							);
						},
						type: 'item',
						keyHint: null,
					},
					{
						id: 'discord',
						value: 'discord',
						label: 'Join Discord community',
						onClick: () => {
							close();
							openExternal('https://discord.com/invite/6VzzNDwUwV');
						},
						type: 'item',
						keyHint: null,
					},
					{
						id: 'help-divider',
						type: 'divider',
					},
					{
						id: 'insta',
						value: 'insta',
						label: 'Instagram',
						onClick: () => {
							close();
							openExternal('https://instagram.com/remotion.dev');
						},
						type: 'item',
						keyHint: null,
					},
					{
						id: 'twitter',
						value: 'twitter',
						label: 'Twitter',
						onClick: () => {
							close();
							openExternal('https://twitter.com/JNYBGR');
						},
						type: 'item',
						keyHint: null,
					},
					{
						id: 'tiktok',
						value: 'tiktok',
						label: 'TikTok',
						onClick: () => {
							close();
							openExternal('https://www.tiktok.com/@remotion.dev');
						},
						type: 'item',
						keyHint: null,
					},
				],
			},
		];
	}, [close, setSelectedModal]);

	const menus = useMemo(() => {
		return structure.map((s) => s.id);
	}, [structure]);

	const onArrowRight = useCallback(() => {
		setSelected((s) => {
			if (s === null) {
				return null;
			}

			return menus[(menus.indexOf(s) + 1) % menus.length];
		});
	}, [menus]);

	const onArrowLeft = useCallback(() => {
		setSelected((s) => {
			if (s === null) {
				return null;
			}

			if (menus.indexOf(s) === 0) {
				return menus[menus.length - 1];
			}

			return menus[(menus.indexOf(s) - 1) % menus.length];
		});
	}, [menus]);

	const onItemQuit = useCallback(() => {
		setSelected(null);
	}, [setSelected]);

	return (
		<div style={row}>
			<div className={MENU_ITEMS_CONTAINER}>
				{structure.map((s) => {
					return (
						<MenuItem
							key={s.id}
							selected={selected === s.id}
							onItemSelected={itemClicked}
							onItemHovered={itemHovered}
							id={s.id}
							label={s.label}
							onItemQuit={onItemQuit}
							menu={s}
							onArrowLeft={onArrowLeft}
							onArrowRight={onArrowRight}
						/>
					);
				})}
			</div>
		</div>
	);
};
