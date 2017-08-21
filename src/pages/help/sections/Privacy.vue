<template>
  <b-card :header="'Privacy Policy'">
    <p>
      Please read this Privacy Policy (“Privacy Policy”) carefully.
    </p>
    <p>
      When you access {{ siteConfig.brand }} this policy binds you. When you create
      an identity on {{ siteConfig.brand }} you are a Contributor and as a
      Contributor you accept and consent to the practices described in this
      Privacy Policy.
    </p>
    <p>
      <strong>Date of last update:</strong> 05 June 2017.
    </p>
    <h3 class="mt-4">Amendments and updates to this policy</h3>
    <p>
      {{ siteConfig.brand }} may amend this Privacy Policy from time to time to
      reflect regulatory requirements or changes in our information collection,
      use or disclosure practices. If this Privacy Policy is changed, the new
      Effective Date will be noted here. You should therefore view this Page
      regularly to view our most up-to-date Privacy Policy.
    </p>
    <h3 class="mt-4">Third-party websites</h3>
    <p>
      This Privacy Policy does not apply to any third-party sites accessed via
      links from {{ siteConfig.brand }}. {{ siteConfig.brand }} has no control over what
      those sites do with information which they collect so it would be absurd
      to claim that {{ siteConfig.brand }} has any responsibility for what those
      sites do. If you want to protect yourself then carefully read through any
      third-party privacy policies before agreeing to their terms or using such
      third party websites.
    </p>
    <h3 class="mt-4">Submission of personal information</h3>
    <p>
      {{ siteConfig.brand }} is an open platform and is designed to allow you and
      other Users and Contributors to share information in an open and
      transparent manner. With the exception of the information collected
      automatically, detailed below and which may include personal information,
      {{ siteConfig.brand }} does not generally expect from or intend for you to
      submit personal or private information. Notwithstanding the above, should
      you submit personal information for any legitimate reason; such
      information will be treated in compliance with legal requirements
      pertaining to personal information which may include legal requirements
      that the information is made available to law enforcement agencies or
      other third parties.
    </p>
    <h3 class="mt-4">What is personal information?</h3>
    <p>
      Personal information means any information relating to a natural person,
      who can be identified, directly or indirectly, in particular by reference
      to an identification number or to one or more factors specific to his or
      her physical, physiological, mental, economic, cultural or social
      identity.
    </p>
    <h4 class="mt-3">Automatic collection of information</h4>
    <p>
      {{ siteConfig.brand }} automatically collects technical information which is
      required to create your login. This includes information which you supply
      such as a social network login if you make use of a social network login,
      the email address you supply, the names you supply. This includes
      automatically collected technical information such as your preferred
      language. {{ siteConfig.brand }} does not require you to use your legal names
      but you must use a valid email address.
    </p>
    <p>
      {{ siteConfig.brand }} receives non-personal information via Google Analytics,
      Google Analytics Demographics and Interest Reporting, such as aggregated
      data of browser type, language preference, referring sites, age, gender,
      or interests, and the time of each visit.
    </p>
    <h3 class="mt-4">Use of information</h3>
    <p>
      {{ siteConfig.brand }} uses the information collected to enable you and others
      to work together and share information using {{ siteConfig.brand }}, as well
      as to better understand how visitors use {{ siteConfig.brand }} and, where
      possible, to improve their experience.
    </p>
    <h3 class="mt-4">Access to information by third parties</h3>
    <p>
    Personal information that you choose to make available on the public
    sections of {{ siteConfig.brand }} can be viewed by third party individuals with
    internet access. The manner in which information available on public pages
    is used by third party individuals falls outside the control of the
    {{ siteConfig.brand }}. You should carefully consider what personal information
    you elect to make available online through {{ siteConfig.brand }}.
    </p>
    <p>
      {{ siteConfig.brand }} will never sell your personal information to third
      parties, without your prior consent. {{ siteConfig.brand }} may disclose your
      personal information as required by law when {{ siteConfig.brand }} believes
      that disclosure is necessary to protect our rights, and/or to comply with
      a judicial proceeding, court order or legal process.
    </p>
    <h4 class="mt-3">Google Analytics and opting out</h4>
    <p>
      {{ siteConfig.brand }} uses Google Analytics to better understand how visitors
      use {{ siteConfig.brand }} and, where possible, to improve their experience.
      If you want to opt-out, there is a browser add-on that you can
      <a href="https://tools.google.com/dlpage/gaoptout/" target="_blank">
        download and install
      </a>.
    </p>
  </b-card>
</template>

<script>
import siteConfig from '@/settings/siteConfig'

export default {
  data: function () {
    return {
      siteConfig: siteConfig
    }
  }
}
</script>
