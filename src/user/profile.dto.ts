import { ApiProperty } from '@nestjs/swagger';

export class ProfileDTO {
  @ApiProperty({ example: 'John Doe', description: 'Nombre del usuario' })
  name: string;
  @ApiProperty({
    example: 'john.doe@example.com',
    description: 'Correo electrónico del usuario',
  })
  email: string;
  @ApiProperty({ example: ['USER'], description: 'Roles del usuario' })
  roles: string[];
  @ApiProperty({
    example: '2025-12-22T07:58:05.000Z',
    description: 'Fecha de creación del usuario',
  })
  createdAt: Date;
  @ApiProperty({
    example: '2025-12-22T07:58:05.000Z',
    description: 'Fecha de actualización del usuario',
  })
  updatedAt: Date;
}
