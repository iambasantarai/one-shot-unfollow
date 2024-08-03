import {
  IgApiClient,
  IgLoginBadPasswordError,
  IgLoginTwoFactorRequiredError,
} from 'instagram-private-api';

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
      return res.redirect('/');
    }

    if (error instanceof IgLoginTwoFactorRequiredError) {
      req.session.twoFactorInfo = error.response.body.two_factor_info;

      return res.redirect('/ig/two-factor');
    }

    console.log('ERROR: ', error);
    return res.redirect('/');
  }
}

export async function twoFactorVerificationHandler(req, res) {
  try {
    const { otp } = req.body;
    console.log('OTP: ', otp);

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
  }
}

export async function unfollowHandler(_req, res) {
  try {
    const following = await ig.feed
      .accountFollowing(ig.state.cookieUserId)
      .items();

    for (const followee of following) {
      console.log('INFO: Unfollowing ', followee.username);
      await ig.friendship.destroy(followee.pk);
    }

    return res.redirect('/ig/unfollow');
  } catch (error) {
    console.log('ERROR: ', error);
  }
}

export async function logoutHandler(_req, res) {
  try {
    await ig.account.logout();

    return res.redirect('/');
  } catch (error) {
    console.log('ERROR: ', error);
  }
}
