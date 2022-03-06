export interface PostGreeting {
  content: string,
  uid: number,
  visible?: boolean,
  uploadedAt?: number,
  anonymous?: boolean,
}

export interface LikeGreeting {
  uid: number,
  gid: number,
  negative?: boolean,
}

export interface ReportGreeting {
  uid: number,
  gid: number,
  type?: number,
  reason?: string,
  negative?: boolean,
}

export interface PostComment {
  uid: number,
  gid: number,
  content: string,
  root: number,
  visible?: boolean,
  uploadedAt?: number,
  anonymous?: boolean,
}

export interface DeleteComment {
  uid?: number,
  gid: number,
  cid: number,
}

export interface GetMessage {
  lastCheck?: number,
  uid?: number,
}

export interface PostMessage {
  title_en: string,
  title_zh_cn: string,
  title_ja: string,
  content_en: string,
  content_zh_cn: string,
  content_ja: string,
  to: number,
  uploadedAt?: number,
}

export interface PostFeedback {
  content: string,
  title: string,
  uid?: number,
}

export interface Participation {
  uid?: number,
  aid: number,
  config?: string,
}

export interface Activity {
  id?: number,
  title: string,
  desc?: string,
  startsAt: string,
  expiresAt: string,
}

export interface CheckParticipation {
  uid?: number,
  aid?: number,
}