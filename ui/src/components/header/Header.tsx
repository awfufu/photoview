import React, { useContext, useState, useMemo } from 'react'
import SearchBar from './Searchbar'

import { authToken } from '../../helpers/authentication'
import { SidebarContext } from '../sidebar/Sidebar'
import classNames from 'classnames'
import { useTranslation } from 'react-i18next'
import { useMutation, useQuery } from '@apollo/client'
import gql from 'graphql-tag'
import Dropdown from '../../primitives/form/Dropdown'
import { LanguageTranslation } from '../../__generated__/globalTypes'
import { changeTheme, getTheme } from '../../theme'
import {
  changeUserPreferences,
  changeUserPreferencesVariables,
} from '../../Pages/SettingsPage/__generated__/changeUserPreferences'
import { myUserPreferences } from '../../Pages/SettingsPage/__generated__/myUserPreferences'
import { TranslationFn } from '../../localization'

const languagePreferences = [
  { key: 1, label: 'English', value: LanguageTranslation.English },
  { key: 2, label: 'Français', value: LanguageTranslation.French },
  { key: 3, label: 'Svenska', value: LanguageTranslation.Swedish },
  { key: 4, label: 'Dansk', value: LanguageTranslation.Danish },
  { key: 5, label: 'Español', value: LanguageTranslation.Spanish },
  { key: 6, label: 'Polski', value: LanguageTranslation.Polish },
  { key: 7, label: 'Italiano', value: LanguageTranslation.Italian },
  { key: 8, label: 'Deutsch', value: LanguageTranslation.German },
  { key: 9, label: 'Русский', value: LanguageTranslation.Russian },
  { key: 10, label: '繁體中文 (香港)', value: LanguageTranslation.TraditionalChineseHK },
  { key: 16, label: '繁體中文 (台灣)', value: LanguageTranslation.TraditionalChineseTW },
  { key: 11, label: '简体中文', value: LanguageTranslation.SimplifiedChinese },
  { key: 12, label: 'Português', value: LanguageTranslation.Portuguese },
  { key: 13, label: 'Euskara', value: LanguageTranslation.Basque },
  { key: 14, label: 'Türkçe', value: LanguageTranslation.Turkish },
  { key: 15, label: 'Українська', value: LanguageTranslation.Ukrainian },
  { key: 17, label: '日本語', value: LanguageTranslation.Japanese },
]

const themePreferences = (t: TranslationFn) => [
  {
    key: 1,
    label: t('settings.user_preferences.theme.auto.label', 'Same as system'),
    value: 'auto',
  },
  {
    key: 2,
    label: t('settings.user_preferences.theme.light.label', 'Light'),
    value: 'light',
  },
  {
    key: 3,
    label: t('settings.user_preferences.theme.dark.label', 'Dark'),
    value: 'dark',
  },
]

const CHANGE_USER_PREFERENCES = gql`
  mutation changeUserPreferences($language: String) {
    changeUserPreferences(language: $language) {
      id
      language
    }
  }
`

const MY_USER_PREFERENCES = gql`
  query myUserPreferences {
    myUserPreferences {
      id
      language
    }
  }
`

const HeaderPreferences = () => {
  const { t } = useTranslation()
  const [theme, setTheme] = useState(getTheme())

  const changeStateTheme = (value: string) => {
    changeTheme(value)
    setTheme(value)
  }

  const { data } = useQuery<myUserPreferences>(MY_USER_PREFERENCES)

  const [changePrefs, { loading: loadingPrefs }] = useMutation<
    changeUserPreferences,
    changeUserPreferencesVariables
  >(CHANGE_USER_PREFERENCES)

  const sortedLanguagePrefs = useMemo(
    () => [...languagePreferences].sort((a, b) => a.label.localeCompare(b.label)),
    []
  )

  return (
    <div className="flex items-center space-x-2">
      <Dropdown
        items={sortedLanguagePrefs}
        className="w-32"
        setSelected={language => {
          changePrefs({
            variables: {
              language: language as LanguageTranslation,
            },
          })
        }}
        selected={data?.myUserPreferences.language || undefined}
        disabled={loadingPrefs}
      />
      <Dropdown
        items={themePreferences(t)}
        className="w-32"
        setSelected={changeStateTheme}
        selected={theme}
      />
    </div>
  )
}

const LogoutButton = () => {
  const { t } = useTranslation()

  return (
    <button
      className="bg-gray-100 hover:bg-gray-200 dark:bg-dark-bg2 dark:hover:bg-gray-700 text-gray-800 dark:text-gray-200 font-semibold py-1 px-3 border border-gray-200 dark:border-dark-border rounded text-sm whitespace-nowrap"
      onClick={() => {
        location.href = '/logout'
      }}
    >
      {t('settings.logout', 'Log out')}
    </button>
  )
}

const Header = () => {
  const { pinned } = useContext(SidebarContext)

  return (
    <div
      className={classNames(
        'sticky top-0 z-10 bg-white dark:bg-dark-bg flex items-center justify-between py-3 px-4 lg:px-8 lg:pt-4 shadow-separator lg:shadow-none',
        { 'mr-[404px]': pinned }
      )}
    >
      <h1 className="mr-4 lg:mr-8 flex-shrink-0 flex items-center">
        <img
          className="h-12 lg:h-10"
          src={import.meta.env.BASE_URL + 'photoview-logo.svg'}
          alt="logo"
        />
        <span className="hidden lg:block ml-2 text-2xl font-light">
          Photoview
        </span>
      </h1>
      {authToken() ? (
        <div className="flex items-center space-x-2">
          <HeaderPreferences />
          <div className="w-full max-w-xs lg:relative">
            <SearchBar />
          </div>
          <LogoutButton />
        </div>
      ) : null}
    </div>
  )
}

export default Header
