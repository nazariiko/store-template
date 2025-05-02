import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { BaseCreatedUpdated } from '../base/base-created-updated.entity';
import { StoreTheme } from './store-theme.entity';

@Entity()
export class StoreMainSettings extends BaseCreatedUpdated {
  @Column({ nullable: false, type: 'boolean', default: true })
  isUserAuthEnabled: boolean;

  @Column({ nullable: false, type: 'boolean', default: true })
  isSearchInHeaderEnabled: boolean;

  @Column({ nullable: false, type: 'boolean', default: true })
  isFavoritesEnabled: boolean;

  @Column({ nullable: false, type: 'boolean', default: true })
  isCommentsEnabled: boolean;

  @Column({ nullable: false, type: 'boolean', default: true })
  isProductRatingEnabled: boolean;

  @Column({ nullable: false, type: 'boolean', default: true })
  isRequirePhoneOnRegistrationEnabled: boolean;

  @Column({ nullable: false })
  storeThemeId: number;

  @JoinColumn({ name: 'storeThemeId' })
  @ManyToOne(() => StoreTheme, (x) => x.storeMainSettings)
  storeTheme: StoreTheme;
}
