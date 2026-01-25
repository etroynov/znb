import { NodeFormat } from '@payloadcms/richtext-lexical';
import type { JSXConverters } from '@payloadcms/richtext-lexical/react';
import clsx from 'clsx';
import type { ReactElement } from 'react';

export const textConverters: Pick<JSXConverters, 'text'> = {
  text: ({ node }) => {
    let text: ReactElement | string = node.text;
    const { $ } = node;

    const classList = [];

    if ($?.fontSize) {
      classList.push($.fontSize);
    }

    if ($?.color) {
      classList.push($.color);
    }

    if ($?.background) {
      classList.push($.background);
    }

    const cn = classList.length > 0 ? classList.join(' ') : undefined;

    if (node.format & NodeFormat.IS_BOLD) {
      text = <strong className={cn}>{text}</strong>;
    }
    if (node.format & NodeFormat.IS_ITALIC) {
      text = <em className={cn}>{text}</em>;
    }
    if (node.format & NodeFormat.IS_STRIKETHROUGH) {
      text = <span className={clsx(cn, 'line-through')}>{text}</span>;
    }
    if (node.format & NodeFormat.IS_UNDERLINE) {
      text = <span className={clsx(cn, 'underline')}>{text}</span>;
    }
    if (node.format & NodeFormat.IS_CODE) {
      text = <code className={cn}>{text}</code>;
    }
    if (node.format & NodeFormat.IS_SUBSCRIPT) {
      text = <sub className={cn}>{text}</sub>;
    }
    if (node.format & NodeFormat.IS_SUPERSCRIPT) {
      text = <sup className={cn}>{text}</sup>;
    }

    return cn ? <span className={cn}>{text}</span> : text;
  },
};
