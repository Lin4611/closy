import type { GetServerSidePropsContext, GetServerSidePropsResult } from 'next'

import { ApiError, apiClient } from '@/lib/api/client'
import type { ApiResponse } from '@/lib/api/types'
import { defaultOccasion, occasionLabelMap, type Occasion } from '@/modules/common/types/occasion'
import type { UserInfo } from '@/modules/common/types/userInfoTypes'
import { colorsLabelMap, type Colors } from '@/modules/settings/types/colorsTypes'
import { stylesLabelMap, type Styles } from '@/modules/settings/types/stylesTypes'

export type SettingsServerPreferences = {
  colors: Colors[]
  styles: Styles[]
  occasions: Occasion
}

export type SettingsServerProfile = Omit<UserInfo, 'preferences'> & {
  preferences: SettingsServerPreferences
}

export type SettingsProfileBaseline = SettingsServerProfile

const settingsColorKeys = Object.keys(colorsLabelMap) as Colors[]
const settingsStyleKeys = Object.keys(stylesLabelMap) as Styles[]
const settingsOccasionKeys = Object.keys(occasionLabelMap) as Occasion[]
const isSettingsColor = (value: string): value is Colors => {
  return settingsColorKeys.includes(value as Colors)
}

const isSettingsStyle = (value: string): value is Styles => {
  return settingsStyleKeys.includes(value as Styles)
}

const isSettingsOccasion = (value: string): value is Occasion => {
  return settingsOccasionKeys.includes(value as Occasion)
}

const normalizeSettingsProfile = (profile: UserInfo): SettingsServerProfile => {
  const colors = profile.preferences.colors.filter(isSettingsColor)
  const styles = profile.preferences.styles.filter(isSettingsStyle)
  const occasions = isSettingsOccasion(profile.preferences.occasions)
    ? profile.preferences.occasions
    : defaultOccasion

  return {
    ...profile,
    preferences: {
      colors,
      styles,
      occasions,
    },
  }
}

export const fetchSettingsServerProfile = async (
  accessToken: string,
): Promise<SettingsServerProfile> => {
  const response = await apiClient<ApiResponse<UserInfo>>({
    baseUrl: process.env.API_BASE_URL,
    endpoint: '/user/information',
    method: 'GET',
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  })

  return normalizeSettingsProfile(response.data)
}

export const buildSettingsProfileBaseline = (
  profile: SettingsServerProfile,
): SettingsProfileBaseline => {
  return profile
}

export const buildSettingsHydrationProfile = (
  profileBaseline: SettingsProfileBaseline,
): UserInfo => {
  return {
    name: profileBaseline.name,
    picture: profileBaseline.picture,
    gender: profileBaseline.gender,
    preferences: {
      styles: profileBaseline.preferences.styles,
      colors: profileBaseline.preferences.colors,
      occasions: profileBaseline.preferences.occasions,
    },
    location: profileBaseline.location,
    hasTodayCalendarEvent: profileBaseline.hasTodayCalendarEvent,
    hasTomorrowCalendarEvent: profileBaseline.hasTomorrowCalendarEvent,
    todayCalendarEventOccasion: profileBaseline.todayCalendarEventOccasion,
    tomorrowCalendarEventOccasion: profileBaseline.tomorrowCalendarEventOccasion,
    hasOutfitGeneratedToday: profileBaseline.hasOutfitGeneratedToday,
    hasOutfitGeneratedTomorrow: profileBaseline.hasOutfitGeneratedTomorrow,
  }
}

export const buildSettingsSummary = (profileBaseline: SettingsProfileBaseline) => {
  return {
    occasion: occasionLabelMap[profileBaseline.preferences.occasions],
    styles: profileBaseline.preferences.styles.length
      ? profileBaseline.preferences.styles.map((style) => stylesLabelMap[style])
      : ['未設定'],
    colors: profileBaseline.preferences.colors.length
      ? profileBaseline.preferences.colors.map((color) => colorsLabelMap[color])
      : ['未設定'],
  }
}

export const getSettingsProtectedServerSideResult = async <TProps extends object>(
  context: Pick<GetServerSidePropsContext, 'req'>,
  mapProps: (profile: SettingsServerProfile) => TProps,
): Promise<GetServerSidePropsResult<TProps>> => {
  const accessToken = context.req.cookies.accessToken

  if (!accessToken) {
    return {
      redirect: {
        destination: '/',
        permanent: false,
      },
    }
  }

  try {
    const profile = await fetchSettingsServerProfile(accessToken)

    return {
      props: mapProps(profile),
    }
  } catch (error) {
    if (error instanceof ApiError && error.statusCode === 401) {
      return {
        redirect: {
          destination: '/',
          permanent: false,
        },
      }
    }

    throw error
  }
}

export const getSettingsProtectedBaselineServerSideResult = async (
  context: Pick<GetServerSidePropsContext, 'req'>,
): Promise<GetServerSidePropsResult<{ profileBaseline: SettingsProfileBaseline }>> => {
  return getSettingsProtectedServerSideResult(context, (profile) => ({
    profileBaseline: buildSettingsProfileBaseline(profile),
  }))
}
