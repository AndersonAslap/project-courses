import {
  BeforeInsert,
  Column,
  CreateDateColumn,
  Entity,
  JoinTable,
  ManyToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

import { v4 as uuidv4 } from 'uuid';

import { Tag } from './tag.entity';

@Entity('courses')
export class Course {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column()
  description: string;

  @Column()
  price: number;

  @Column({ default: true })
  active: boolean;

  @JoinTable()
  @ManyToMany(() => Tag, (tag: Tag) => tag.courses, {
    cascade: true,
  })
  tags: string[];

  @CreateDateColumn({ type: 'timestamp' })
  created_at?: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updated_at?: Date;

  @BeforeInsert()
  generatedId() {
    if (this.id) {
      return;
    }

    this.id = uuidv4();
  }
}
