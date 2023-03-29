import React, {useCallback} from 'react';
import type {z} from 'remotion';
import {Button} from '../../../preview-server/error-overlay/remotion-overlay/Button';
import {RemTextarea} from '../NewComposition/RemTextarea';
import {ValidationMessage} from '../NewComposition/ValidationMessage';
import {
	deserializeJSONWithDate,
	serializeJSONWithDate,
} from './SchemaEditor/date-serialization';

type State =
	| {
			str: string;
			value: unknown;
			validJSON: true;
	  }
	| {
			str: string;
			validJSON: false;
			error: string;
	  };

const parseJSON = (str: string): State => {
	try {
		const value = deserializeJSONWithDate(str);
		return {str, value, validJSON: true};
	} catch (e) {
		return {str, validJSON: false, error: (e as Error).message};
	}
};

const style: React.CSSProperties = {
	fontFamily: 'monospace',
	height: 400,
};

const schemaButton: React.CSSProperties = {
	border: 'none',
	padding: 0,
	display: 'inline-block',
	cursor: 'pointer',
	backgroundColor: 'transparent',
};

// TODO: Note if custom 'remotion-date:' pattern has been used
export const RenderModalJSONInputPropsEditor: React.FC<{
	value: unknown;
	setValue: React.Dispatch<React.SetStateAction<unknown>>;
	zodValidationResult: z.SafeParseReturnType<unknown, unknown>;
	switchToSchema: () => void;
}> = ({setValue, value, zodValidationResult, switchToSchema}) => {
	const [localValue, setLocalValue] = React.useState<State>(() => {
		return parseJSON(serializeJSONWithDate(value, 2));
	});

	const onPretty = useCallback(() => {
		if (!localValue.validJSON) {
			return;
		}

		const parsed = JSON.parse(localValue.str);
		setLocalValue({...localValue, str: JSON.stringify(parsed, null, 2)});
	}, [localValue]);

	const onChange: React.ChangeEventHandler<HTMLTextAreaElement> = useCallback(
		(e) => {
			const parsed = parseJSON(e.target.value);
			if (parsed.validJSON) {
				setLocalValue({
					str: e.target.value,
					value: parsed.value,
					validJSON: parsed.validJSON,
				});
			} else {
				setLocalValue({
					str: e.target.value,
					validJSON: parsed.validJSON,
					error: parsed.error,
				});
			}

			if (parsed.validJSON) {
				setValue(parsed.value);
			}
		},
		[setValue]
	);

	return (
		<div>
			<RemTextarea
				onChange={onChange}
				value={localValue.str}
				status={localValue.validJSON ? 'ok' : 'error'}
				style={style}
			/>
			{localValue.validJSON === false ? (
				<ValidationMessage
					align="flex-start"
					message={localValue.error}
					type="error"
				/>
			) : zodValidationResult.success === false ? (
				<button type="button" style={schemaButton} onClick={switchToSchema}>
					<ValidationMessage
						align="flex-start"
						message="Does not match schema"
						type="warning"
					/>
				</button>
			) : null}
			<br />
			<Button disabled={!localValue.validJSON} onClick={onPretty}>
				Format JSON
			</Button>
		</div>
	);
};