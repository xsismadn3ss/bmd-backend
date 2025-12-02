import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsNumber } from "class-validator";

export class BoundariesDTO {
    @ApiProperty({
        example: 13.148,
        description: "min latitude",
        type: Number
    })
    @IsNotEmpty()
    @IsNumber()
    minLat: number;

    @ApiProperty({
        example: 14.445,
        description: "max latitude",
        type: Number
    })
    @IsNotEmpty()
    @IsNumber()
    maxLat: number;

    @ApiProperty({
        example: -90.193,
        description: "min longitude",
        type: Number
    })
    @IsNotEmpty()
    @IsNumber()
    minLng: number;

    @ApiProperty({
        example: -87.692,
        description: "max longitude",
        type: Number
    })
    @IsNotEmpty()
    @IsNumber()
    maxLng: number
}