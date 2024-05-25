"use strict";
/*
 * Copyright (c) 2014-2023 Bjoern Kimminich & the OWASP Juice Shop contributors.
 * SPDX-License-Identifier: MIT
 */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const frisby = require("frisby");
const config_1 = __importDefault(require("config"));
const path_1 = __importDefault(require("path"));
const fs = require('fs');
const jsonHeader = { 'content-type': 'application/json' };
const REST_URL = 'http://localhost:3000/rest';
const URL = 'http://localhost:3000';
describe('/profile/image/file', () => {
    it('POST profile image file valid for JPG format', () => {
        const file = path_1.default.resolve(__dirname, '../files/validProfileImage.jpg');
        const form = frisby.formData();
        form.append('file', fs.createReadStream(file));
        return frisby.post(`${REST_URL}/user/login`, {
            headers: jsonHeader,
            body: {
                email: `jim@${config_1.default.get('application.domain')}`,
                password: 'ncc-1701'
            }
        })
            .expect('status', 200)
            .then(({ json: jsonLogin }) => {
            return frisby.post(`${URL}/profile/image/file`, {
                headers: {
                    Cookie: `token=${jsonLogin.authentication.token}`,
                    // @ts-expect-error FIXME form.getHeaders() is not found
                    'Content-Type': form.getHeaders()['content-type']
                },
                body: form,
                redirect: 'manual'
            })
                .expect('status', 302);
        });
    });
    it('POST profile image file invalid type', () => {
        const file = path_1.default.resolve(__dirname, '../files/invalidProfileImageType.docx');
        const form = frisby.formData();
        form.append('file', fs.createReadStream(file));
        return frisby.post(`${REST_URL}/user/login`, {
            headers: jsonHeader,
            body: {
                email: `jim@${config_1.default.get('application.domain')}`,
                password: 'ncc-1701'
            }
        })
            .expect('status', 200)
            .then(({ json: jsonLogin }) => {
            return frisby.post(`${URL}/profile/image/file`, {
                headers: {
                    Cookie: `token=${jsonLogin.authentication.token}`,
                    // @ts-expect-error FIXME form.getHeaders() is not found
                    'Content-Type': form.getHeaders()['content-type']
                },
                body: form
            })
                .expect('status', 415)
                .expect('header', 'content-type', /text\/html/)
                .expect('bodyContains', `<h1>${config_1.default.get('application.name')} (Express`)
                .expect('bodyContains', 'Error: Profile image upload does not accept this file type');
        });
    });
    it('POST profile image file forbidden for anonymous user', () => {
        const file = path_1.default.resolve(__dirname, '../files/validProfileImage.jpg');
        const form = frisby.formData();
        form.append('file', fs.createReadStream(file));
        return frisby.post(`${URL}/profile/image/file`, {
            // @ts-expect-error FIXME form.getHeaders() is not found
            headers: { 'Content-Type': form.getHeaders()['content-type'] },
            body: form
        })
            .expect('status', 500)
            .expect('header', 'content-type', /text\/html/)
            .expect('bodyContains', 'Error: Blocked illegal activity');
    });
});
describe('/profile/image/url', () => {
    it('POST profile image URL valid for image available online', () => {
        const form = frisby.formData();
        form.append('imageUrl', 'https://placekitten.com/g/100/100');
        return frisby.post(`${REST_URL}/user/login`, {
            headers: jsonHeader,
            body: {
                email: `jim@${config_1.default.get('application.domain')}`,
                password: 'ncc-1701'
            }
        })
            .expect('status', 200)
            .then(({ json: jsonLogin }) => {
            return frisby.post(`${URL}/profile/image/url`, {
                headers: {
                    Cookie: `token=${jsonLogin.authentication.token}`,
                    // @ts-expect-error FIXME form.getHeaders() is not found
                    'Content-Type': form.getHeaders()['content-type']
                },
                body: form,
                redirect: 'manual'
            })
                .expect('status', 302);
        });
    });
    it('POST profile image URL redirects even for invalid image URL', () => {
        const form = frisby.formData();
        form.append('imageUrl', 'https://notanimage.here/100/100');
        return frisby.post(`${REST_URL}/user/login`, {
            headers: jsonHeader,
            body: {
                email: `jim@${config_1.default.get('application.domain')}`,
                password: 'ncc-1701'
            }
        })
            .expect('status', 200)
            .then(({ json: jsonLogin }) => {
            return frisby.post(`${URL}/profile/image/url`, {
                headers: {
                    Cookie: `token=${jsonLogin.authentication.token}`,
                    // @ts-expect-error FIXME form.getHeaders() is not found
                    'Content-Type': form.getHeaders()['content-type']
                },
                body: form,
                redirect: 'manual'
            })
                .expect('status', 302);
        });
    });
    xit('POST profile image URL forbidden for anonymous user', () => {
        const form = frisby.formData();
        form.append('imageUrl', 'https://placekitten.com/g/100/100');
        return frisby.post(`${URL}/profile/image/url`, {
            // @ts-expect-error FIXME form.getHeaders() is not found
            headers: { 'Content-Type': form.getHeaders()['content-type'] },
            body: form
        })
            .expect('status', 500)
            .expect('header', 'content-type', /text\/html/)
            .expect('bodyContains', 'Error: Blocked illegal activity');
    });
});
//# sourceMappingURL=profileImageUploadSpec.js.map