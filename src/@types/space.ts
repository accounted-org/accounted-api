export type Space = {
  id: string;
  name: string;
  isPersonal: boolean;
  createdAt: Date;
  updatedAt: Date;
};

export type SpaceMember = {
  id: string;
  memberId: string;
  spaceId: string;
  role: string;
  createdAt: Date;
  updatedAt: Date;
};

export enum ESpaceMemberRole {
  OWNER = 'OWNER',
  MEMBER = 'MEMBER',
}
