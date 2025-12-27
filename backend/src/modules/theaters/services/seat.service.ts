import { BadRequestException, Injectable } from '@nestjs/common';
import { ROOM_LIMITS, SEAT_TYPES } from '../constants';
import { SeatType } from '../types';
import { Seat, SeatMap } from '../schemas';

@Injectable()
export class SeatService {
  public constructor() {
    //
  }

  /** */
  public isValidSeatCode(seatCode: string) {
    const seatCodePattern = /^[A-Z]\d+$/;
    return seatCodePattern.test(seatCode);
  }

  /** */
  public calculateCapacity(seatMap: SeatMap): number {
    return seatMap
      .flatMap((row) => row)
      .filter((seat) => seat && seat.isActive !== false).length;
  }

  /** */
  public buildSeatMap(seatMapRaw: (SeatType | null)[][]): SeatMap {
    if (!Array.isArray(seatMapRaw) || seatMapRaw.length === 0)
      throw new BadRequestException('Seat map must be a non-empty 2D array');

    if (
      seatMapRaw.length < ROOM_LIMITS.MIN_ROWS ||
      seatMapRaw.length > ROOM_LIMITS.MAX_ROWS
    ) {
      throw new BadRequestException(
        `Room must have between ${ROOM_LIMITS.MIN_ROWS} and ${ROOM_LIMITS.MAX_ROWS} rows`,
      );
    }

    return seatMapRaw.map((row, idx) => this.buildSeatRow(row, idx));
  }

  /** */
  private buildSeatRow(
    row: (SeatType | null)[],
    rowIdx: number,
  ): (Seat | null)[] {
    if (!Array.isArray(row) || row.length === 0) {
      throw new BadRequestException(`Row ${rowIdx} must be a non-empty array`);
    }

    if (
      row.length < ROOM_LIMITS.MIN_SEATS_PER_ROW ||
      row.length > ROOM_LIMITS.MAX_SEATS_PER_ROW
    ) {
      throw new BadRequestException(
        `Row ${rowIdx} must have between ${ROOM_LIMITS.MIN_SEATS_PER_ROW} and ${ROOM_LIMITS.MAX_SEATS_PER_ROW} seats`,
      );
    }

    const seatRow: (Seat | null)[] = [];
    let seatNo = 1;

    for (let colIdx = 0; colIdx < row.length; colIdx++) {
      const seatType = row[colIdx];

      if (!seatType) {
        seatRow.push(null);
        continue;
      }

      // COUPLE SEAT HANDLING
      if (seatType === SEAT_TYPES.COUPLE) {
        if (row[colIdx + 1] !== SEAT_TYPES.COUPLE) {
          throw new BadRequestException(
            `COUPLE seat at row ${rowIdx}, col ${colIdx} must be paired`,
          );
        }

        const code = this.generateSeatCode(rowIdx, seatNo);
        seatRow.push({ seatCode: code, seatType });
        seatRow.push({ seatCode: code, seatType });

        seatNo += 2;
        colIdx++;
        continue;
      }

      seatRow.push({
        seatCode: this.generateSeatCode(rowIdx, seatNo),
        seatType,
      });
      seatNo++;
    }

    return seatRow;
  }

  /** */
  private generateSeatCode(row: number, seatNo: number): string {
    let n = row;
    let code = '';
    do {
      code = String.fromCharCode(65 + (n % 26)) + code;
      n = Math.floor(n / 26) - 1;
    } while (n >= 0);

    return `${code}${seatNo}`;
  }
}
