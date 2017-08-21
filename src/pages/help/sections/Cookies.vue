<template>
  <b-card :header="'Cookies Policy'">
    <p>
      {{ siteConfig.brand }} uses cookies to make our website easier for you to use
      and improve your overall experience, distinguish you from other users and
      provide increased functionality.
    </p>
    <h3 class="mt-4">What are cookies?</h3>
    <p>
      Cookies are small text files that websites save to your computer. They
      often include a randomly generated number which is stored on your device.
      Many cookies are automatically deleted after you finish using the website.
      Others remain on your computer to provide a seamless user experience – for
      example, by remembering which goods in an online shopping basket.
    </p>
    <p>
      Cookies are commonly used to improve the browsing experience; measure
      website performance; support the delivery of services; and support sharing
      information through social media platforms, such as Twitter or Facebook.
    </p>
    <p>
      Unless you have adjusted your browser settings to refuse cookies, our
      systems will issue cookies as soon you visit our website or access other
      online services. If you have switched off cookies then some of the
      functionality of our services may not be available to you.
    </p>
    <p>
        The following video from Google gives an explanation of how cookies
        work:
    </p>
    <div class="text-center my-4">
      <iframe
        width="640"
        height="386"
        src="https://www.youtube.com/embed/TBR-xtJVq7E"
        frameborder="0"
        allowfullscreen>
      </iframe>
    </div>
    <h3 class="mt-4">Disabling cookies</h3>
    <p>
      You can block cookies by activating the setting on your browser that
      allows you to refuse all or some cookies. However, if you use your browser
      settings to block all cookies (including essential cookies) you may not be
      able to access parts of our website, or you may experience reduced
      functionality when accessing certain services. Unless you have adjusted
      your browser setting so that it will refuse cookies, our system will issue
      cookies as soon you visit our website.
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
