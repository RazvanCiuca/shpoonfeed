class RootController < ApplicationController
  def root
    @user = User.new
    render "users/sign_up"
  end
end
