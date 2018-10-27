import React, {useState} from 'react';
import {Link} from 'react-router-dom';

// language dropdown nav item for when translations are enabled
function LanguageDropDown(props) {
  const [showDropdown, setShowDropdown] = useState(false);
  const {env, metadata, siteConfig} = props;
  const {language: thisLanguage, permalink} = metadata;
  const {translationRecruitingLink, baseUrl} = siteConfig;

  // add all enabled languages to dropdown
  const enabledLanguages = env.translation.enabledLanguages
    .filter(lang => lang.tag !== thisLanguage)
    .map(lang => {
      const href = permalink.replace(`/${thisLanguage}/`, `/${lang.tag}/`);
      return (
        <li key={lang.tag}>
          <Link to={href}>{lang.name}</Link>
        </li>
      );
    });

  // if no languages are enabled , return null
  if (enabledLanguages.length < 1 || !env.translation.enabled) {
    return null;
  }

  // Get the current language full name for display in the header nav
  const currentLanguage = env.translation.enabledLanguages.find(
    lang => lang.tag === thisLanguage,
  ).name;

  // add Crowdin project recruiting link
  if (translationRecruitingLink) {
    /* TODO translate/ i18n this string */
    const helpTranslateString =
      'Help Translate|recruit community translators for your project';
    enabledLanguages.push(
      <li key="recruiting">
        <a
          href={translationRecruitingLink}
          target="_blank"
          rel="noreferrer noopener">
          {helpTranslateString}
        </a>
      </li>,
    );
  }

  return (
    <span>
      <li key="languages">
        {/* eslint-disable-next-line */}
        <a
          id="languages-menu"
          href="#"
          onClick={() => setShowDropdown(!showDropdown)}>
          <img
            className="languages-icon"
            src={`${baseUrl}img/language.svg`}
            alt="Languages icon"
          />
          {currentLanguage}
        </a>
        <div
          id="languages-dropdown"
          className={showDropdown ? 'visible' : 'hide'}>
          <ul id="languages-dropdown-items">{enabledLanguages}</ul>
        </div>
      </li>
    </span>
  );
}

export default LanguageDropDown;
