export function getDayLabel(weekDateNumber: number): string {
  const weekDays = [
    'Chủ Nhật',
    'Thứ Hai',
    'Thứ Ba',
    'Thứ Tư',
    'Thứ Năm',
    'Thứ Sáu',
    'Thứ Bảy',
  ];
  if (weekDateNumber < 0 || weekDateNumber > 6) {
    throw new Error('Week date number should be between 1 and 7');
  }
  return weekDays[weekDateNumber];
}
