<?php

/*
 * Notifications JS package for Bear Framework
 * https://github.com/ivopetkov/notifications-js-bearframework-addon
 * Copyright (c) Ivo Petkov
 * Free to use under the MIT license.
 */

use \BearFramework\App;

$app = App::get();
$context = $app->contexts->get(__DIR__);

$app->clientPackages
    ->add('notifications', function (IvoPetkov\BearFrameworkAddons\ClientPackage $package) use ($context): void {
        $package->addJSCode(include $context->dir . '/assets/notifications.min.js.php');
        //$package->addJSCode(file_get_contents($context->dir . '/dev/notifications.js'));
        $css = '[data-notification]{position:fixed;bottom:0;z-index:999;cursor:default;}';
        $package->addCSSCode($css);
        $package->get = 'return ivoPetkov.bearFrameworkAddons.notifications';
    });
