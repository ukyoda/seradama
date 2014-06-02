#!/bin/perl

# --------------------------------------------------------
# 定数定義
# --------------------------------------------------------
$RET_OK = 0;						# 正常
$RET_NG = -1;						# 異常

$NUM_MINSIZE			= 0;		# 汎用数値最低設定値
$FIELD_WIDTH_MAXSIZE	= 100;		# フィールド(x座標)最大値
$FIELD_HEIGHT_MAXSIZE	= 100;		# フィールド(y座標)最大値
$FIELD_GRID_MAXSIZE 	= 256;		# フィールド(グリッド)最大値

$FIELD_SET_FILENAME		= "";		# フィールド情報ファイル名設定値
$FIELD_SET_NAME			= "";		# フィールド名設定値
$FIELD_SET_WIDTH		= "";		# フィールド(x座標)設定値
$FIELD_SET_HEIGHT		= "";		# フィールド(y座標)設定値
$FIELD_SET_GRID			= "";		# フィールド(グリッド)設定値
# --------------------------------------------------------


# --------------------------------------------------------
# 関数定義
# --------------------------------------------------------
# USAGE
sub USAGE
{
	printf("ERROR: 引数誤り 引数=[%d]\n",$#ARGV+1);
	printf("INFO : ＜USAGE＞\n");
	printf("     :   %s\n",$0);
}

# 改行コード削除関数
sub DEL_CLRF
{
	$STR=@_[0];

	# CR削除
	$STR =~ s/\r//;
	# LF削除
	$STR =~ s/\n//;

	return $STR;
}

# 数値チェック関数
sub CHK_NUM
{
	$VAL = @_[0];

	# 数値チェック
	if($VAL !~ /^[0-9]+$/)
	{
		return $RET_NG;	# チェックNG
	}
	
	# 最大最小値チェック
	if($NUM_MINSIZE >= $VAL)
	{
		return $RET_NG;	# チェックNG
	}

	if($VAL >= @_[1])
	{
		return $RET_NG;	# チェックNG
	}
	
	return $RET_OK;		# チェックOK
}

# フィールド(x座標)設定関数
sub SET_FIELD_WIDTH_FUNC
{
	my $field_x_len;

	while(1)
	{
		printf("フィールド(x座標)サイズを設定してください > ");
		# x座標値設定
		$field_x_len = <STDIN>;

		# 入力値チェック
		$field_x_len = DEL_CLRF($field_x_len);
		$RET = CHK_NUM($field_x_len, $FIELD_WIDTH_MAXSIZE);

		if($RET == $RET_OK)
		{
			last;		# 戻り値が正常のため、ループを抜ける
		}
		# 戻り値が異常の場合、再度設定させる
		printf("ERROR: RET内容=[%d]\n", $RET);
	
		printf("設定値に誤りがあります。 設定内容=[%s]\n", $field_x_len);
		printf("設定値は以下の範囲で設定してください。 (%d < 設定値 < %d)\n\n", $NUM_MINSIZE, $FIELD_WIDTH_MAXSIZE);

		next;
	}

	return $field_x_len;
}

# フィールド(y座標)設定関数
sub SET_FIELD_HEIGHT_FUNC
{
	my $field_y_len;

	while(1)
	{
		printf("フィールド(y座標)サイズを設定してください > ");
		# y座標値設定
		$field_y_len = <STDIN>;

		# 入力値チェック
		$field_y_len = DEL_CLRF($field_y_len);
		$RET = CHK_NUM($field_y_len, $FIELD_HEIGHT_MAXSIZE);

		if($RET == $RET_OK)
		{
			last;		# 戻り値が正常のため、ループを抜ける
		}
		# 戻り値が異常の場合、再度設定させる
		printf("ERROR: RET内容=[%d]\n", $RET);
	
		printf("設定値に誤りがあります。 設定内容=[%s]\n", $field_y_len);
		printf("設定値は以下の範囲で設定してください。 (%d < 設定値 < %d)\n\n", $NUM_MINSIZE, $FIELD_HEIGHT_MAXSIZE);

		next;
	}

	return $field_y_len;
}

# フィールド(グリッド)設定関数
sub SET_FIELD_GRID_FUNC
{
	my $field_grid_len;

	while(1)
	{
		printf("フィールド(グリッド)サイズを設定してください > ");
		# グリッド値設定
		$field_grid_len = <STDIN>;

		# 入力値チェック
		$field_grid_len = DEL_CLRF($field_grid_len);
		$RET = CHK_NUM($field_grid_len, $FIELD_GRID_MAXSIZE);

		if($RET == $RET_OK)
		{
			last;		# 戻り値が正常のため、ループを抜ける
		}
		# 戻り値が異常の場合、再度設定させる
		printf("ERROR: RET内容=[%d]\n", $RET);
	
		printf("設定値に誤りがあります。 設定内容=[%s]\n", $field_grid_len);
		printf("設定値は以下の範囲で設定してください。 (%d < 設定値 < %d)\n\n", $NUM_MINSIZE, $FIELD_GRID_MAXSIZE);

		next;
	}

	return $field_grid_len;
}

# フィールド情報設定内容確認
sub SET_FIELD_PARAM_CHK
{
	my $CHK_PARAM;
	printf("\n【フィールド情報設定内容確認】\n");
	printf("★-------------------------------★\n");
	printf("フィールド(x座標)設定値=[%d]\nフィールド(y座標)設定値=[%d]\nフィールド(グリッド)設定値=[%d]\n",
																						 @_[0], @_[1], @_[2]);
	printf("★-------------------------------★\n\n");
	printf("上記設定内容でフィールドを作成します。\n設定内容に問題なければ y を入力してください。 > ");
	$CHK_PARAM = <STDIN>;

	if($CHK_PARAM !~ /^[yY]$/)
	{
		return $RET_NG;
	}

	return $RET_OK;
}

# 文字列設定内容確認
sub SET_NAME_CHK
{
	my $CHK_PARAM;
	printf("\n【%s設定内容確認】\n", @_[0]);
	printf("★-------------------------------★\n");
	printf("%s設定値=[%s]\n", @_[0], @_[1]);
	printf("★-------------------------------★\n\n");
	printf("上記設定内容で%sを設定します。\n設定内容に問題なければ y を入力してください。 > ", @_[0]);
	$CHK_PARAM = <STDIN>;

	if($CHK_PARAM !~ /^[yY]$/)
	{
		return $RET_NG;
	}

	return $RET_OK;
}

# フィールド情報ファイル作成処理
sub MAKE_FIELD_FILE
{
	$make_field_file_name  = @_[0];
	$make_field_name       = @_[1];
	$make_field_width_num  = @_[2];
	$make_field_height_num = @_[3];
	$make_field_grid_num   = @_[4];

	$wrk_str = "";
	$wrk_field_map = "";

	open(FD, ">$make_field_file_name");

	# ファイル先頭行出力
	printf(FD "\{\n");

	# フィールド名出力
	printf(FD "\t\"name\": \"%s\",\n", $make_field_name);

	# フィールド情報出力先頭行出力
	printf(FD "\t\"world\": \{\n");
	# フィールド情報(x座標)出力
	printf(FD "\t\t\"width\": %d,\n", $make_field_width_num);
	# フィールド情報(y座標)出力
	printf(FD "\t\t\"height\": %d,\n", $make_field_height_num);
	# フィールド情報(グリッド)出力
	printf(FD "\t\t\"grid\": %d\n", $make_field_grid_num);
	# フィールド情報出力終端行出力
	printf(FD "\t\},\n");
	
	# フィールドマップ情報先頭行出力
	printf(FD "\t\"mapdata\": \[\n");

	# フィールドマップ情報文字列作成
	$wrk_field_map = MAKE_FIELD_MAP($make_field_width_num, $make_field_height_num);

	$DB::single = 1;

	for($i = 0; $i < $make_field_height_num ; $i++)
	{
		printf(FD "\t\t");
		$wrk_str = substr($wrk_field_map, $i*$make_field_width_num*2, $make_field_width_num*2);
		printf(FD "%s\n", $wrk_str);
	}

	# フィールドマップ情報終端行出力
	printf(FD "\t\]\n");

	# ファイル終端行出力
	printf(FD "\}\n");

	close(FD);
}

sub MAKE_FIELD_MAP
{
	# フィールド情報取得
	$x_cnt = @_[0];
	$y_cnt = @_[1];

	$STR_RET = "";

	$DB::single = 1;

	for($i = 0; $i < $y_cnt; $i++)
	{
		if($i == 0)
		{
			# 上壁作成
			for($j = 0; $j < $x_cnt; $j++)
			{
				$STR_RET = $STR_RET . "1,";
			}
		}
		elsif($i == $y_cnt-1)
		{
			# 下壁作成
			for($j = 0; $j < $x_cnt; $j++)
			{
				if($j == $x_cnt-1)
				{
					# 文字列終端
					$STR_RET = $STR_RET . "1";
				}
				else
				{
					$STR_RET = $STR_RET . "1,";
				}
			}
		}
		else
		{
			for($j = 0; $j < $x_cnt; $j++)
			{
				if($j == 0)
				{
					# 左壁作成
					$STR_RET = $STR_RET . "1,";
				}
				elsif($j == $x_cnt-1)
				{
					# 右壁作成
					$STR_RET = $STR_RET . "1,";
				}
				else
				{
					# フィールド内部作成
					$STR_RET = $STR_RET . "0,";
				}
			}
		}
	}

	return $STR_RET;
}

# --------------------------------------------------------
# 処理開始
# --------------------------------------------------------

# 引数チェック
if ($#ARGV != -1)
{
	USAGE();
	exit 0;
}

# ツール起動
printf("＜グラコロフィールドマップ作成ツール開始＞\n");
printf("INFO : グラコロフィールドマップ作成ツール起動開始！！\n\n");
printf("★☆------ フィールド情報定義 -----☆★\n\n");

# フィールド情報定義
printf("【フィールド情報定義】\n");

while(1)
{
	# フィールド(x座標)設定
	$FIELD_SET_WIDTH = SET_FIELD_WIDTH_FUNC();
	printf("フィールドのx座標設定サイズ=[%d]\n", $FIELD_SET_WIDTH);

	# フィールド(y座標)設定
	$FIELD_SET_HEIGHT = SET_FIELD_HEIGHT_FUNC();
	printf("フィールドのy座標設定サイズ=[%d]\n", $FIELD_SET_HEIGHT);

	# フィールド(グリッド)設定
	# 現状グリッドは固定値で設定
	#$FIELD_SET_GRID = 32;
	$FIELD_SET_GRID = SET_FIELD_GRID_FUNC();
	printf("フィールドのグリッド設定サイズ=[%d]\n", $FIELD_SET_GRID);

	$RET = SET_FIELD_PARAM_CHK( $FIELD_SET_WIDTH, $FIELD_SET_HEIGHT, $FIELD_SET_GRID );
	if($RET == $RET_OK)
	{
		last;
	}

	printf("\nフィールド情報を再入力してください。\n\n");
}

printf("\n★☆------ フィールド名定義 -----☆★\n\n");
while(1)
{
	printf("上記内容で生成するフィールドの名前を入力してください。 > ");
	$FIELD_SET_NAME = <STDIN>;
	$FIELD_SET_NAME = DEL_CLRF($FIELD_SET_NAME);

	$RET = SET_NAME_CHK("フィールド名", $FIELD_SET_NAME);

	if($RET == $RET_OK)
	{
		last;
	}

	printf("\nフィールド名を再入力してください。\n\n");
}

printf("\n★☆------ フィールド情報ファイル名定義 -----☆★\n\n");
while(1)
{
	printf("フィールド情報ファイル名を入力してください。 > ");
	$FIELD_SET_FILENAME = <STDIN>;
	$FIELD_SET_FILENAME = DEL_CLRF($FIELD_SET_FILENAME);

	$RET = SET_NAME_CHK("フィールド情報ファイル名", $FIELD_SET_FILENAME);

	if($RET == $RET_OK)
	{
		last;
	}

	printf("\nフィールド情報ファイル名を再入力してください。\n\n");
}

printf("\n★☆------ フィールド情報ファイル作成 -----☆★\n\n");
$RET = MAKE_FIELD_FILE( $FIELD_SET_FILENAME, 
						$FIELD_SET_NAME,
						$FIELD_SET_WIDTH,
						$FIELD_SET_HEIGHT,
						$FIELD_SET_GRID);

printf("INFO : グラコロフィールドマップ作成ツール終了！！\n");
printf("＜グラコロフィールドマップ作成ツール停止＞\n");
printf("-----------\n");

