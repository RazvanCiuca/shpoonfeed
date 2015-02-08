class SessionsController < ApplicationController
  
  def new
    @user = User.new
    render :sign_in
  end
  
  def facebook_auth
    @user = User.find_or_create_from_auth_hash(request.env['omniauth.auth'])
    login!(@user)
    p user_url(@user)
    redirect_to user_url(@user) 
  end
  
  def create
    @user = User.find_by_credentials(params[:user])
    if @user
      login!(@user)
      redirect_to user_url(@user)
    else
      @errors = "Your username and password combination is not valid. Try again!"
      render :sign_in
    end
  end
  
  def destroy
    logout!
    redirect_to new_session_url
  end
  
end
