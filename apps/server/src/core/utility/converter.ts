import { BASE64 } from '@repo/dto';
import { ArgumentNullOrEmptyException } from '../exception/argument-null-or-empty';

export class Converter {
  public static base64ToBuffer(base64: string): Buffer {
    if (!base64) {
      throw new ArgumentNullOrEmptyException('base64');
    }
    const buffer = Buffer.from(base64, BASE64);
    return buffer;
  }

  public static bufferToBase64(buffer: Buffer): string {
    if (!buffer) {
      throw new ArgumentNullOrEmptyException('buffer');
    }
    const base64 = Buffer.from(buffer).toString(BASE64);
    return base64;
  }

  public static toUtcDateByString(value: string): Date {
    if (!value) {
      throw new ArgumentNullOrEmptyException('value');
    }
    value = value.includes('Z') ? value.replace('Z', '') : value;
    return new Date(value);
  }

  public static stringFormat(
    value: string,
    ...params: Array<string | number>
  ): string {
    if (!value) {
      throw new ArgumentNullOrEmptyException('value');
    }
    if (!params) {
      throw new ArgumentNullOrEmptyException('params');
    }
    for (let i = 0; i < params.length; i++) {
      value = value.replace(`{${i}}`, params[i].toString());
    }
    return value;
  }

  public static translateToCyrillic(value: string): string {
    let answer = '';
    const converter = {
      а: 'a',
      б: 'b',
      в: 'v',
      г: 'h',
      ґ: 'g',
      д: 'd',
      е: 'e',
      є: 'ie',
      ж: 'zh',
      з: 'z',
      и: 'y',
      і: 'i',
      ї: 'i',
      й: 'i',
      к: 'k',
      л: 'l',
      м: 'm',
      н: 'n',
      о: 'o',
      п: 'p',
      р: 'r',
      с: 's',
      т: 't',
      у: 'u',
      ф: 'f',
      х: 'kh',
      ц: 'ts',
      ч: 'ch',
      ш: 'sh',
      щ: 'shch',
      ь: '',
      ю: 'iu',
      я: 'ia',
      А: 'A',
      Б: 'B',
      В: 'V',
      Г: 'H',
      Ґ: 'G',
      Д: 'D',
      Е: 'E',
      Є: 'Ye',
      Ж: 'Zh',
      З: 'Z',
      И: 'Y',
      І: 'I',
      Ї: 'Yi',
      Й: 'Y',
      К: 'K',
      Л: 'L',
      М: 'M',
      Н: 'N',
      О: 'O',
      П: 'P',
      Р: 'R',
      С: 'S',
      Т: 'T',
      У: 'U',
      Ф: 'F',
      Х: 'Kh',
      Ц: 'Ts',
      Ч: 'Ch',
      Ш: 'Sh',
      Щ: 'Shch',
      Ю: 'Yu',
      Я: 'Ya',
      ' ': '',
    };
    for (let i = 0; i < value.length; ++i) {
      if (converter[value[i]] == undefined) {
        answer += value[i];
      } else {
        answer += converter[value[i]];
      }
    }
    return answer;
  }

  public static wrapInBracketsWithSpace(value: string): string {
    value = value ? ` (${value})` : '';
    return value;
  }

  public static concat(values: string[], separator = ' '): string {
    return values.join(separator);
  }
}
