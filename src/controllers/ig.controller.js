import {
  IgApiClient,
  IgLoginBadPasswordError,
  IgLoginTwoFactorRequiredError,
} from 'instagram-private-api';

import { getRandomNumber } from '../utils/randomNumber.util.js';

const ig = new IgApiClient();

export async function loginHandler(req, res) {
  const { username, password } = req.body;
  ig.state.generateDevice(username);
  ig.simulate.preLoginFlow();

  try {
    const loggedInUser = await ig.account.login(username, password);

    const following = await ig.feed.accountFollowing().items();

    return res.render('unfollow', {
      username: loggedInUser.username,
      followingCount: Object.entries(following).length,
    });
  } catch (error) {
    if (error instanceof IgLoginBadPasswordError) {
      req.flash('info', error.response.body.message);
      return res.redirect('/');
    }

    if (error instanceof IgLoginTwoFactorRequiredError) {
      req.session.twoFactorInfo = error.response.body.two_factor_info;

      req.flash('info', error.response.body.message);
      return res.redirect('/ig/two-factor');
    }

    console.log('ERROR: ', error);

    req.flash('info', error.response.body.message);
    return res.redirect('/');
  }
}

export async function twoFactorVerificationHandler(req, res) {
  try {
    const { otp } = req.body;

    const { username, totp_two_factor_on, two_factor_identifier } =
      req.session.twoFactorInfo;

    const verificationMethod = totp_two_factor_on ? '0' : '1';

    const loggedInUser = await ig.account.twoFactorLogin({
      username,
      verificationCode: otp,
      twoFactorIdentifier: two_factor_identifier,
      verificationMethod,
    });

    const following = await ig.feed.accountFollowing().items();

    return res.render('unfollow', {
      username: loggedInUser.username,
      followingCount: Object.entries(following).length,
    });
  } catch (error) {
    console.log('ERROR: ', error);

    req.flash('info', error.response.body.message);
    return res.redirect('/ig/two-factor');
  }
}

export async function unfollowHandler(req, res) {
  try {
    const following = await ig.feed
      .accountFollowing(ig.state.cookieUserId)
      .items();

    const randomTimes = [15, 17, 19];
    const randomIndex = getRandomNumber(0, randomTimes.length - 1);

    for (const followee of following) {
      const randomDelay = randomTimes[randomIndex] * 1000;

      setTimeout(async () => {
        console.log('INFO: Unfollowing ', followee.username);
        await ig.friendship.destroy(followee.pk);
      }, randomDelay);
    }

    req.flash('info', 'Unfollowed all!');
    return res.redirect('/');
  } catch (error) {
    console.log('ERROR: ', error);

    req.flash('info', error.response.body.message);
    return res.redirect('/ig/unfollow');
  }
}

export async function logoutHandler(req, res) {
  try {
    await ig.account.logout();

    req.flash('info', 'Bye!');
    return res.redirect('/');
  } catch (error) {
    console.log('ERROR: ', error);

    req.flash('info', error.response.body.message);
    return res.redirect('/ig/unfollow');
  }
}
