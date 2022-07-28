export class UpdateCourseDto {
  readonly name: string;
  readonly description: string;
  readonly price: number;
}

export class UpdateCourseFildsDto {
  readonly name?: string;
  readonly description?: string;
  readonly price?: number;
}
