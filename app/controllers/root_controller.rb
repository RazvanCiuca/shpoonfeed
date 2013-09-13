class RootController < ApplicationController
 
  def root
    if current_user
      redirect_to user_url(current_user)
    else
      @user = User.new
      render "users/sign_up"
    end
  end
end
