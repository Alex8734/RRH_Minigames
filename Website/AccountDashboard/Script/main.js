const buttonPassword = document.getElementById('password-button');
const buttonAccount = document.getElementById('account-button');
const container = document.getElementById('container');

buttonPassword.addEventListener('click', () => {
    container.innerHTML = `<div id="password">
        <h3 class="mb-4">Password Settings</h3>
        <div class="row">
            <div class="col-md-6">
                <div class="form-group">
                    <label>Current password</label>
                    <input type="password" class="form-control">
                </div>
            </div>
        </div>
        <div class="row">
            <div class="col-md-6">
                <div class="form-group">
                    <label>New password</label>
                    <input type="password" class="form-control">
                </div>
            </div>
            <div class="col-md-6">
                <div class="form-group">
                    <label>Confirm new password</label>
                    <input type="password" class="form-control">
                </div>
            </div>
        </div>
        <div>
            <button class="btn btn-primary">Update</button>
        </div>
    </div>`;
});

buttonAccount.addEventListener("click", () => {
    container.innerHTML = `<div class="tab-pane fade show active" id="account" role="tabpanel" aria-labelledby="account-tab">
        <h3 class="mb-4">Account Settings</h3>
        <div class="row">
            <div class="col-md-6">
                <div class="form-group">
                    <label>Username</label>
                    <input type="text" class="form-control" value="">
                </div>
            </div>
            <div class="col-md-6">
                <div class="form-group">
                    <label>E-mail</label>
                    <input type="text" class="form-control" value="">
                </div>
            </div>
        </div>
        <div>
            <button class="btn btn-primary">Update</button>
        </div>
    </div>`
});

document.getElementById('profile').addEventListener('click', function() {
    window.location.href = './AccountDashboard/index.html';
});