class RootController < ApplicationController
 
  def root
    if current_user
      redirect_to user_url(current_user)
    else
      @user = User.new
      render "session/sign_in"
    end
  end
end
